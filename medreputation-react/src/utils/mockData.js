import { supabase } from '../lib/supabase';

/**
 * Fonction pour ajouter un cabinet avec des données de test
 * Permet de tester immédiatement l'interface
 */
export const addClinicWithMockData = async (placeId = null) => {
    try {
        // 1. Créer le cabinet
        const { data: clinic, error: clinicError } = await supabase
            .from('clinics')
            .insert([
                {
                    name: 'Cabinet Dr. Dupont',
                    google_place_id: placeId || 'ChIJMockPlaceId123',
                    address: '123 Rue de la Santé, 75014 Paris',
                    phone: '01 23 45 67 89',
                    email: 'contact@cabinet-dupont.fr'
                }
            ])
            .select()
            .single();

        if (clinicError) throw clinicError;

        console.log('✅ Cabinet créé:', clinic);

        // 2. Ajouter des avis de test
        const mockReviews = [
            {
                clinic_id: clinic.id,
                author: 'Marie D.',
                rating: 5,
                text: 'Excellent accueil, le Dr. Dupont est très à l\'écoute. Je recommande vivement ce cabinet. L\'équipe est professionnelle et l\'attente est raisonnable.',
                review_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                sentiment_score: 0.95,
                sentiment_label: 'Positif',
                tags: ['accueil', 'écoute', 'professionnel', 'positif'],
                is_critical: false,
                has_sensitive_content: false,
                status: 'pending'
            },
            {
                clinic_id: clinic.id,
                author: 'Jean M.',
                rating: 2,
                text: 'Temps d\'attente beaucoup trop long (2h), et le médecin semblait pressé. Déçu du service, je ne reviendrai pas.',
                review_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                sentiment_score: -0.65,
                sentiment_label: 'Critique',
                tags: ['attente', 'négatif'],
                is_critical: true,
                has_sensitive_content: false,
                status: 'pending'
            },
            {
                clinic_id: clinic.id,
                author: 'Sophie L.',
                rating: 1,
                text: 'Très mauvaise expérience. Le Dr. Dupont m\'a diagnostiqué un diabète sans faire d\'analyses approfondies. Je suis allée voir un autre médecin qui a infirmé ce diagnostic. Incompétent !',
                review_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                sentiment_score: -0.95,
                sentiment_label: 'Critique',
                tags: ['négatif', 'compétence'],
                is_critical: true,
                has_sensitive_content: true,
                detected_risks: ['Nom: Dr. Dupont', 'Diagnostic: diabète', 'Accusation: incompétent'],
                status: 'pending'
            },
            {
                clinic_id: clinic.id,
                author: 'Pierre B.',
                rating: 4,
                text: 'Bon cabinet médical. Le docteur prend son temps pour expliquer. Seul bémol : le parking est difficile à trouver.',
                review_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                sentiment_score: 0.65,
                sentiment_label: 'Positif',
                tags: ['écoute', 'parking', 'positif'],
                is_critical: false,
                has_sensitive_content: false,
                status: 'pending'
            },
            {
                clinic_id: clinic.id,
                author: 'Lucie R.',
                rating: 5,
                text: 'Cabinet très propre, personnel accueillant. Le Dr. Dupont a été très professionnel lors de ma consultation. Je recommande !',
                review_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                sentiment_score: 0.90,
                sentiment_label: 'Positif',
                tags: ['hygiène', 'accueil', 'professionnel', 'positif'],
                is_critical: false,
                has_sensitive_content: false,
                has_response: true,
                response_text: 'Bonjour Lucie,\n\nMerci infiniment pour votre confiance et ce retour positif. C\'est une grande satisfaction pour toute notre équipe.\n\nCordialement,\nCabinet Dr. Dupont',
                response_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'responded'
            }
        ];

        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .insert(mockReviews)
            .select();

        if (reviewsError) throw reviewsError;

        console.log(`✅ ${reviews.length} avis créés`);

        // 3. Créer un rapport d'analyse
        const { data: report, error: reportError } = await supabase
            .from('analysis_reports')
            .insert([
                {
                    clinic_id: clinic.id,
                    compliance_score: 98,
                    trust_index: 87,
                    response_rate: 20, // 1/5 avis répondu
                    total_reviews: 5,
                    average_rating: 3.4,
                    negative_rate: 40,
                    positive_rate: 60,
                    ai_summary: 'Analyse de 5 avis. Note moyenne: 3.4/5. Points forts: écoute, professionnalisme. Points faibles: temps d\'attente.',
                    top_strengths: ['écoute', 'professionnel', 'hygiène'],
                    top_weaknesses: ['attente', 'parking'],
                    critical_keywords: ['attente', 'écoute', 'professionnel', 'accueil', 'hygiène'],
                    recommended_actions: [
                        'Optimiser la gestion des rendez-vous',
                        'Répondre aux avis critiques',
                        'Améliorer la signalétique parking'
                    ],
                    period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    period_end: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (reportError) throw reportError;

        console.log('✅ Rapport d\'analyse créé');

        return {
            success: true,
            clinic,
            reviewsCount: reviews.length,
            report
        };

    } catch (error) {
        console.error('❌ Erreur lors de la création des données de test:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Supprimer toutes les données de test
 */
export const clearMockData = async () => {
    try {
        // Supprimer tous les cabinets (cascade delete pour les avis)
        const { error } = await supabase
            .from('clinics')
            .delete()
            .ilike('name', '%Cabinet Dr. Dupont%');

        if (error) throw error;

        console.log('✅ Données de test supprimées');
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Ajouter un avis unique pour test
 */
export const addMockReview = async (clinicId, rating = 5) => {
    const templates = {
        5: {
            author: 'Test Positif',
            text: 'Excellent service, très professionnel.',
            sentiment: 'Positif',
            tags: ['positif', 'professionnel']
        },
        1: {
            author: 'Test Négatif',
            text: 'Très déçu, temps d\'attente inacceptable.',
            sentiment: 'Critique',
            tags: ['négatif', 'attente']
        }
    };

    const template = templates[rating] || templates[5];

    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([
                {
                    clinic_id: clinicId,
                    author: template.author,
                    rating,
                    text: template.text,
                    review_date: new Date().toISOString(),
                    sentiment_label: template.sentiment,
                    tags: template.tags,
                    is_critical: rating <= 2,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        console.log('✅ Avis de test ajouté');
        return { success: true, review: data };
    } catch (error) {
        console.error('❌ Erreur:', error);
        return { success: false, error: error.message };
    }
};
