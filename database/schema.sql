-- ============================================
-- MEDREPUTATION SUPABASE DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: clinics
-- Stockage des cabinets médicaux
-- ============================================
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    google_place_id VARCHAR(255) UNIQUE,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_clinics_owner ON clinics(owner_id);
CREATE INDEX idx_clinics_google_place ON clinics(google_place_id);

-- ============================================
-- TABLE: reviews
-- Stockage des avis patients
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
    author VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    text TEXT NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE,
    source VARCHAR(50) DEFAULT 'google_maps', -- google_maps, facebook, doctolib
    
    -- Analyse IA
    sentiment_score DECIMAL(3,2), -- -1.00 à 1.00
    sentiment_label VARCHAR(50), -- Positif, Neutre, Critique
    tags TEXT[], -- Array de tags: ['hygiène', 'attente', 'accueil']
    is_critical BOOLEAN DEFAULT FALSE,
    has_sensitive_content BOOLEAN DEFAULT FALSE,
    detected_risks TEXT[],
    
    -- Gestion des réponses
    has_response BOOLEAN DEFAULT FALSE,
    response_text TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    
    -- Statut
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, responded, archived
    flagged BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_reviews_clinic ON reviews(clinic_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_critical ON reviews(is_critical);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_date ON reviews(review_date DESC);

-- ============================================
-- TABLE: analysis_reports
-- Rapports d'analyse générés par l'IA
-- ============================================
CREATE TABLE analysis_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
    
    -- Scores
    compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
    trust_index INTEGER CHECK (trust_index >= 0 AND trust_index <= 100),
    response_rate INTEGER CHECK (response_rate >= 0 AND response_rate <= 100),
    
    -- Métriques
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1),
    negative_rate DECIMAL(5,2),
    positive_rate DECIMAL(5,2),
    
    -- Analyse IA
    ai_summary TEXT,
    top_strengths TEXT[],
    top_weaknesses TEXT[],
    critical_keywords TEXT[],
    recommended_actions TEXT[],
    
    -- Benchmark
    local_rank INTEGER,
    competitor_data JSONB,
    
    -- Période d'analyse
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_reports_clinic ON analysis_reports(clinic_id);
CREATE INDEX idx_reports_created ON analysis_reports(created_at DESC);

-- ============================================
-- TABLE: alerts
-- Alertes de réputation
-- ============================================
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    
    -- Type d'alerte
    alert_type VARCHAR(50) NOT NULL, -- low_rating, critical_keyword, negative_trend
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    
    -- Détails
    title VARCHAR(255) NOT NULL,
    description TEXT,
    triggered_by TEXT,
    
    -- Statut
    status VARCHAR(50) DEFAULT 'active', -- active, in_progress, resolved, dismissed
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_alerts_clinic ON alerts(clinic_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- ============================================
-- TABLE: response_templates
-- Templates de réponses Medical-Safe
-- ============================================
CREATE TABLE response_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- thanks, delays, confidential, defamatory
    content TEXT NOT NULL,
    variables TEXT[], -- ['{{Nom_Patient}}', '{{Nom_Cabinet}}']
    
    -- Usage
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    is_shared BOOLEAN DEFAULT FALSE, -- Template partagé avec tous les utilisateurs
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_templates_clinic ON response_templates(clinic_id);
CREATE INDEX idx_templates_category ON response_templates(category);
CREATE INDEX idx_templates_shared ON response_templates(is_shared);

-- ============================================
-- TABLE: notification_settings
-- Configuration des notifications
-- ============================================
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Canaux
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    
    -- Triggers
    rating_threshold INTEGER DEFAULT 3,
    critical_keywords TEXT[],
    
    -- Contacts
    email_recipients TEXT[],
    phone_numbers TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Policies pour clinics
CREATE POLICY "Users can view their own clinics"
    ON clinics FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own clinics"
    ON clinics FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own clinics"
    ON clinics FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own clinics"
    ON clinics FOR DELETE
    USING (auth.uid() = owner_id);

-- Policies pour reviews
CREATE POLICY "Users can view reviews of their clinics"
    ON reviews FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM clinics
            WHERE clinics.id = reviews.clinic_id
            AND clinics.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert reviews for their clinics"
    ON reviews FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM clinics
            WHERE clinics.id = reviews.clinic_id
            AND clinics.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update reviews of their clinics"
    ON reviews FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM clinics
            WHERE clinics.id = reviews.clinic_id
            AND clinics.owner_id = auth.uid()
        )
    );

-- Policies similaires pour les autres tables
CREATE POLICY "Users can view their clinic reports"
    ON analysis_reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM clinics
            WHERE clinics.id = analysis_reports.clinic_id
            AND clinics.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their clinic alerts"
    ON alerts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM clinics
            WHERE clinics.id = alerts.clinic_id
            AND clinics.owner_id = auth.uid()
        )
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_clinics_updated_at
    BEFORE UPDATE ON clinics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Fonction pour calculer automatiquement is_critical
CREATE OR REPLACE FUNCTION set_review_critical_flag()
RETURNS TRIGGER AS $$
BEGIN
    -- Marquer comme critique si note <= 2 ou contenu sensible détecté
    NEW.is_critical := (NEW.rating <= 2) OR (NEW.has_sensitive_content = TRUE);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_critical_flag
    BEFORE INSERT OR UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION set_review_critical_flag();

-- ============================================
-- SAMPLE DATA (Optionnel - pour tests)
-- ============================================

-- Exemple de cabinet
-- INSERT INTO clinics (name, address, phone, owner_id)
-- VALUES ('Cabinet Dr. Dupont', '123 Rue de la Santé, Paris', '01 23 45 67 89', auth.uid());

-- Exemple d'avis
-- INSERT INTO reviews (clinic_id, author, rating, text, review_date, sentiment_label, tags)
-- VALUES (
--     (SELECT id FROM clinics WHERE name = 'Cabinet Dr. Dupont'),
--     'Marie D.',
--     5,
--     'Excellent accueil, très professionnel',
--     NOW(),
--     'Positif',
--     ARRAY['accueil', 'professionnel']
-- );
