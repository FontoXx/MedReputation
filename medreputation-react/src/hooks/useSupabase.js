import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook personnalisé pour récupérer et calculer les statistiques d'un cabinet
 * @param {string} clinicId - ID du cabinet
 * @returns {object} Stats calculées en temps réel
 */
export const useClinicStats = (clinicId) => {
    const [stats, setStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        negativeRate: 0,
        positiveRate: 0,
        topKeywords: [],
        criticalCount: 0,
        responseRate: 0,
        trustIndex: 0,
        loading: true,
        error: null
    });

    useEffect(() => {
        if (!clinicId) {
            setStats(prev => ({ ...prev, loading: false }));
            return;
        }

        fetchAndCalculateStats();
    }, [clinicId]);

    const fetchAndCalculateStats = async () => {
        try {
            setStats(prev => ({ ...prev, loading: true, error: null }));

            // Récupérer tous les avis du cabinet
            const { data: reviews, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('clinic_id', clinicId)
                .order('review_date', { ascending: false });

            if (error) throw error;

            if (!reviews || reviews.length === 0) {
                setStats({
                    totalReviews: 0,
                    averageRating: 0,
                    negativeRate: 0,
                    positiveRate: 0,
                    topKeywords: [],
                    criticalCount: 0,
                    responseRate: 0,
                    trustIndex: 0,
                    loading: false,
                    error: null
                });
                return;
            }

            // Calculs
            const totalReviews = reviews.length;
            const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = (sumRatings / totalReviews).toFixed(1);

            const negativeReviews = reviews.filter(r => r.rating < 3).length;
            const positiveReviews = reviews.filter(r => r.rating >= 4).length;
            const negativeRate = ((negativeReviews / totalReviews) * 100).toFixed(1);
            const positiveRate = ((positiveReviews / totalReviews) * 100).toFixed(1);

            const criticalCount = reviews.filter(r => r.is_critical).length;
            const respondedCount = reviews.filter(r => r.has_response).length;
            const responseRate = ((respondedCount / totalReviews) * 100).toFixed(0);

            // Calculer le Trust Index (formule personnalisée)
            const trustIndex = Math.min(100, Math.round(
                (parseFloat(averageRating) / 5) * 40 + // 40% basé sur note moyenne
                (100 - parseFloat(negativeRate)) * 0.3 + // 30% basé sur taux négatif inversé
                parseFloat(responseRate) * 0.3 // 30% basé sur taux de réponse
            ));

            // Extraire les top 3 mots-clés
            const allTags = reviews.flatMap(r => r.tags || []);
            const tagCounts = allTags.reduce((acc, tag) => {
                acc[tag] = (acc[tag] || 0) + 1;
                return acc;
            }, {});

            const topKeywords = Object.entries(tagCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([tag]) => tag);

            setStats({
                totalReviews,
                averageRating: parseFloat(averageRating),
                negativeRate: parseFloat(negativeRate),
                positiveRate: parseFloat(positiveRate),
                topKeywords,
                criticalCount,
                responseRate: parseInt(responseRate),
                trustIndex,
                loading: false,
                error: null
            });

        } catch (error) {
            console.error('Error fetching clinic stats:', error);
            setStats(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
        }
    };

    return { ...stats, refresh: fetchAndCalculateStats };
};

/**
 * Hook pour récupérer les avis d'un cabinet
 * @param {string} clinicId - ID du cabinet
 * @param {object} filters - Filtres optionnels
 */
export const useReviews = (clinicId, filters = {}) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!clinicId) {
            setLoading(false);
            return;
        }

        fetchReviews();
    }, [clinicId, JSON.stringify(filters)]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            let query = supabase
                .from('reviews')
                .select('*')
                .eq('clinic_id', clinicId);

            // Appliquer les filtres
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.isCritical !== undefined) {
                query = query.eq('is_critical', filters.isCritical);
            }
            if (filters.minRating) {
                query = query.gte('rating', filters.minRating);
            }
            if (filters.maxRating) {
                query = query.lte('rating', filters.maxRating);
            }

            query = query.order('review_date', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;

            setReviews(data || []);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { reviews, loading, error, refresh: fetchReviews };
};

/**
 * Hook pour récupérer les cabinets de l'utilisateur
 */
export const useClinics = () => {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClinics();
    }, []);

    const fetchClinics = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('clinics')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setClinics(data || []);
        } catch (err) {
            console.error('Error fetching clinics:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addClinic = async (clinicData) => {
        try {
            // Récupérer l'utilisateur connecté
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('Utilisateur non connecté');

            // Ajouter l'owner_id automatiquement
            const dataWithOwner = {
                ...clinicData,
                owner_id: user.id
            };

            const { data, error } = await supabase
                .from('clinics')
                .insert([dataWithOwner])
                .select()
                .single();

            if (error) throw error;

            setClinics(prev => [data, ...prev]);
            return { data, error: null };
        } catch (err) {
            console.error('Error adding clinic:', err);
            return { data: null, error: err.message };
        }
    };

    const deleteClinic = async (clinicId) => {
        try {
            const { error } = await supabase
                .from('clinics')
                .delete()
                .eq('id', clinicId);

            if (error) throw error;

            setClinics(prev => prev.filter(c => c.id !== clinicId));
            return { error: null };
        } catch (err) {
            console.error('Error deleting clinic:', err);
            return { error: err.message };
        }
    };

    return { clinics, loading, error, addClinic, deleteClinic, refresh: fetchClinics };
};

/**
 * Hook pour récupérer les alertes d'un cabinet
 * @param {string} clinicId - ID du cabinet
 */
export const useAlerts = (clinicId) => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!clinicId) {
            setLoading(false);
            return;
        }

        fetchAlerts();
    }, [clinicId]);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('alerts')
                .select('*, reviews(*)')
                .eq('clinic_id', clinicId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setAlerts(data || []);
        } catch (err) {
            console.error('Error fetching alerts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resolveAlert = async (alertId) => {
        try {
            const { error } = await supabase
                .from('alerts')
                .update({
                    status: 'resolved',
                    resolved_at: new Date().toISOString()
                })
                .eq('id', alertId);

            if (error) throw error;

            await fetchAlerts();
            return { error: null };
        } catch (err) {
            console.error('Error resolving alert:', err);
            return { error: err.message };
        }
    };

    return { alerts, loading, error, resolveAlert, refresh: fetchAlerts };
};

/**
 * Hook pour gérer les paramètres de notification d'un cabinet
 * @param {string} clinicId - ID du cabinet
 */
export const useNotificationSettings = (clinicId) => {
    const [settings, setSettings] = useState({
        email_enabled: true,
        sms_enabled: false,
        whatsapp_enabled: false,
        rating_threshold: 2,
        critical_keywords: [],
        email_recipients: [],
        phone_numbers: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!clinicId) {
            setLoading(false);
            return;
        }

        fetchSettings();
    }, [clinicId]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('notification_settings')
                .select('*')
                .eq('clinic_id', clinicId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

            if (data) {
                setSettings(data);
            }
        } catch (err) {
            console.error('Error fetching notification settings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const { error } = await supabase
                .from('notification_settings')
                .upsert({
                    clinic_id: clinicId,
                    ...newSettings
                });

            if (error) throw error;

            setSettings({ ...settings, ...newSettings });
            return { error: null };
        } catch (err) {
            console.error('Error updating notification settings:', err);
            return { error: err.message };
        }
    };

    return { settings, loading, error, updateSettings, refresh: fetchSettings };
};

/**
 * Hook pour gérer les templates de réponse
 * @param {string} clinicId - ID du cabinet
 */
export const useTemplates = (clinicId) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!clinicId) {
            setLoading(false);
            return;
        }

        fetchTemplates();
    }, [clinicId]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('response_templates')
                .select('*')
                .or(`clinic_id.eq.${clinicId},is_shared.eq.true`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setTemplates(data || []);
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addTemplate = async (templateData) => {
        try {
            const { data, error } = await supabase
                .from('response_templates')
                .insert([{
                    ...templateData,
                    clinic_id: clinicId
                }])
                .select()
                .single();

            if (error) throw error;

            setTemplates(prev => [data, ...prev]);
            return { data, error: null };
        } catch (err) {
            console.error('Error adding template:', err);
            return { data: null, error: err.message };
        }
    };

    const updateTemplate = async (templateId, updates) => {
        try {
            const { data, error } = await supabase
                .from('response_templates')
                .update(updates)
                .eq('id', templateId)
                .select()
                .single();

            if (error) throw error;

            setTemplates(prev => prev.map(t => t.id === templateId ? data : t));
            return { error: null };
        } catch (err) {
            console.error('Error updating template:', err);
            return { error: err.message };
        }
    };

    const deleteTemplate = async (templateId) => {
        try {
            const { error } = await supabase
                .from('response_templates')
                .delete()
                .eq('id', templateId);

            if (error) throw error;

            setTemplates(prev => prev.filter(t => t.id !== templateId));
            return { error: null };
        } catch (err) {
            console.error('Error deleting template:', err);
            return { error: err.message };
        }
    };

    return { templates, loading, error, addTemplate, updateTemplate, deleteTemplate, refresh: fetchTemplates };
};

/**
 * Hook pour gérer les rapports d'analyse
 * @param {string} clinicId - ID du cabinet
 */
export const useReports = (clinicId) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!clinicId) {
            setLoading(false);
            return;
        }

        fetchReports();
    }, [clinicId]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('analysis_reports')
                .select('*')
                .eq('clinic_id', clinicId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setReports(data || []);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { reports, loading, error, refresh: fetchReports };
};
