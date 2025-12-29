import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const medReputationAPI = {
    // Analyser des avis
    analyzeReviews: async (reviewsText, practiceName) => {
        const response = await api.post('/api/analyze', {
            reviews_text: reviewsText,
            practice_name: practiceName,
        });
        return response.data;
    },

    // Générer une réponse conforme
    generateResponse: async (reviewText, reviewRating, practiceName, practicePhone) => {
        const response = await api.post('/api/generate-response', {
            review_text: reviewText,
            review_rating: reviewRating,
            practice_name: practiceName,
            practice_phone: practicePhone,
        });
        return response.data;
    },

    // Détecter contenu sensible
    detectSensitive: async (reviewText) => {
        const response = await api.post('/api/detect-sensitive', {
            review_text: reviewText,
        });
        return response.data;
    },

    // Health check
    healthCheck: async () => {
        const response = await api.get('/health');
        return response.data;
    },
};

export default api;
