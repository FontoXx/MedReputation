/**
 * Service d'analyse IA pour les avis médicaux
 * Utilise l'API backend (Ollama/Llama 3.2) pour analyser les avis
 */

import { medReputationAPI } from './api';

/**
 * Analyse un avis avec l'IA pour extraire sentiment, tags et suggestion de réponse
 * @param {string} reviewText - Texte de l'avis
 * @param {number} rating - Note de 1 à 5
 * @param {object} clinicInfo - Informations du cabinet
 * @returns {Promise<object>} Résultat de l'analyse
 */
export const analyzeReviewWithAI = async (reviewText, rating, clinicInfo = {}) => {
    try {
        // 1. Détecter le contenu sensible
        const sensitiveCheck = await medReputationAPI.detectSensitive(reviewText);

        // 2. Généré une réponse Medical-Safe
        const responseData = await medReputationAPI.generateResponse(
            reviewText,
            rating,
            clinicInfo.name || 'Cabinet',
            clinicInfo.phone || ''
        );

        // 3. Extraire les tags automatiquement
        const tags = extractTags(reviewText, rating);

        // 4. Déterminer le sentiment
        let sentiment = 'Neutre';
        let sentimentScore = 0;

        if (rating >= 4) {
            sentiment = 'Positif';
            sentimentScore = 0.5 + (rating / 10); // 0.9 à 1.0
        } else if (rating <= 2) {
            sentiment = 'Critique';
            sentimentScore = -0.5 - ((3 - rating) / 10); // -0.7 à -1.0
        } else {
            sentimentScore = 0; // Neutre
        }

        // 5. Compiler le résultat
        return {
            sentiment,
            sentimentScore,
            sentimentLabel: sentiment,
            tags,
            isCritical: rating <= 2 || sensitiveCheck.has_sensitive_content,
            hasSensitiveContent: sensitiveCheck.has_sensitive_content,
            detectedRisks: sensitiveCheck.detected_items || [],
            riskScore: sensitiveCheck.risk_score || 0,
            suggestedResponse: responseData.response,
            responseType: responseData.response_type,
            complianceNotes: responseData.compliance_notes || []
        };

    } catch (error) {
        console.error('AI Analysis Error:', error);

        // Fallback: analyse basique sans IA
        return {
            sentiment: rating >= 4 ? 'Positif' : rating <= 2 ? 'Critique' : 'Neutre',
            sentimentScore: (rating - 3) / 2,
            sentimentLabel: rating >= 4 ? 'Positif' : rating <= 2 ? 'Critique' : 'Neutre',
            tags: extractTags(reviewText, rating),
            isCritical: rating <= 2,
            hasSensitiveContent: false,
            detectedRisks: [],
            riskScore: 0,
            suggestedResponse: null,
            responseType: 'Erreur',
            complianceNotes: [],
            error: error.message
        };
    }
};

/**
 * Extrait les tags d'un avis basé sur des mots-clés
 * @param {string} text - Texte de l'avis
 * @param {number} rating - Note
 * @returns {string[]} Liste de tags
 */
const extractTags = (text, rating) => {
    const textLower = text.toLowerCase();
    const tags = [];

    // Dictionnaire de mots-clés par catégorie
    const keywords = {
        'accueil': ['accueil', 'secrétariat', 'réception', 'accueillant'],
        'attente': ['attente', 'retard', 'délai', 'temps d\'attente', 'ponctualité'],
        'hygiène': ['hygiène', 'propreté', 'propre', 'sale', 'nettoyage'],
        'prix': ['prix', 'tarif', 'cher', 'coût', 'facture'],
        'écoute': ['écoute', 'attentif', 'empathie', 'bienveillant', 'comprendre'],
        'compétence': ['compétent', 'professionnel', 'expertise', 'qualifié'],
        'parking': ['parking', 'stationnement', 'garer'],
        'localisation': ['localisation', 'accès', 'trouver', 'adresse'],
    };

    // Détecter les tags
    Object.entries(keywords).forEach(([tag, words]) => {
        if (words.some(word => textLower.includes(word))) {
            tags.push(tag);
        }
    });

    // Ajouter tag basé sur la note
    if (rating >= 4) {
        tags.push('positif');
    } else if (rating <= 2) {
        tags.push('négatif');
    }

    return [...new Set(tags)]; // Supprimer les doublons
};

/**
 * Analyse en batch plusieurs avis
 * @param {Array} reviews - Liste d'avis
 * @param {object} clinicInfo - Info du cabinet
 * @returns {Promise<Array>} Avis analysés
 */
export const analyzeBatchReviews = async (reviews, clinicInfo) => {
    const promises = reviews.map(review =>
        analyzeReviewWithAI(review.text, review.rating, clinicInfo)
            .then(analysis => ({
                ...review,
                ...analysis
            }))
            .catch(error => ({
                ...review,
                error: error.message
            }))
    );

    return Promise.all(promises);
};

/**
 * Génère un rapport d'analyse consolidé
 * @param {string} clinicId - ID du cabinet
 * @param {Array} reviews - Liste des avis
 * @returns {Promise<object>} Rapport complet
 */
export const generateAnalysisReport = async (clinicId, reviews) => {
    try {
        // Analyse consolidée
        const totalReviews = reviews.length;
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        const negativeCount = reviews.filter(r => r.rating < 3).length;
        const positiveCount = reviews.filter(r => r.rating >= 4).length;

        // Extraire les forces et faiblesses
        const allTags = reviews.flatMap(r => r.tags || []);
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

        const sortedTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a);

        const positiveTags = sortedTags
            .filter(([tag]) => ['positif', 'écoute', 'compétence', 'accueil'].includes(tag))
            .slice(0, 3)
            .map(([tag]) => tag);

        const negativeTags = sortedTags
            .filter(([tag]) => ['négatif', 'attente', 'prix', 'parking'].includes(tag))
            .slice(0, 3)
            .map(([tag]) => tag);

        // Générer recommandations
        const recommendations = [];
        if (negativeCount > totalReviews * 0.15) {
            recommendations.push('Réduire le taux d\'avis négatifs (<15%)');
        }
        if (allTags.includes('attente')) {
            recommendations.push('Optimiser la gestion des rendez-vous');
        }
        if (allTags.includes('accueil')) {
            recommendations.push('Former le personnel d\'accueil');
        }

        return {
            clinic_id: clinicId,
            compliance_score: 98, // À calculer dynamiquement
            trust_index: Math.round((avgRating / 5) * 100),
            response_rate: 0, // À calculer
            total_reviews: totalReviews,
            average_rating: parseFloat(avgRating.toFixed(1)),
            negative_rate: parseFloat(((negativeCount / totalReviews) * 100).toFixed(2)),
            positive_rate: parseFloat(((positiveCount / totalReviews) * 100).toFixed(2)),
            ai_summary: `Analyse de ${totalReviews} avis. Note moyenne: ${avgRating.toFixed(1)}/5.`,
            top_strengths: positiveTags,
            top_weaknesses: negativeTags,
            critical_keywords: sortedTags.slice(0, 5).map(([tag]) => tag),
            recommended_actions: recommendations
        };

    } catch (error) {
        console.error('Report generation error:', error);
        throw error;
    }
};
