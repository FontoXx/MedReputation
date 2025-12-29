import React, { useState } from 'react';
import {
    Bell,
    ShieldAlert,
    Smartphone,
    MessageSquare,
    Mail,
    AlertTriangle,
    CheckCircle,
    Eye,
    FileText,
    X,
    Plus,
    Trash2
} from 'lucide-react';
import { useAlerts, useNotificationSettings } from '../hooks/useSupabase';
import { LoadingSpinner } from './LoadingSkeleton';

const AlertsPage = ({ selectedPractice }) => {
    // Hooks Supabase
    const { alerts, loading: alertsLoading, resolveAlert } = useAlerts(selectedPractice);
    const { settings, loading: settingsLoading, updateSettings } = useNotificationSettings(selectedPractice);

    const [newKeyword, setNewKeyword] = useState('');
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [showCrisisModal, setShowCrisisModal] = useState(false);

    const addKeyword = async () => {
        if (newKeyword.trim() && !settings.critical_keywords?.includes(newKeyword.trim())) {
            const updatedKeywords = [...(settings.critical_keywords || []), newKeyword.trim()];
            await updateSettings({ critical_keywords: updatedKeywords });
            setNewKeyword('');
        }
    };

    const removeKeyword = async (keyword) => {
        const updatedKeywords = settings.critical_keywords?.filter(k => k !== keyword) || [];
        await updateSettings({ critical_keywords: updatedKeywords });
    };

    const toggleNotification = async (channel) => {
        await updateSettings({ [`${channel}_enabled`]: !settings[`${channel}_enabled`] });
    };

    const handleRatingThresholdChange = async (value) => {
        await updateSettings({ rating_threshold: parseInt(value) });
    };

    const openCrisisModal = (alert) => {
        setSelectedAlert(alert);
        setShowCrisisModal(true);
    };

    const getStatusBadge = (status) => {
        const badges = {
            critical: { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle, text: 'Critique' },
            surveillance: { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: Eye, text: 'En surveillance' },
            resolved: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle, text: 'Résolu' }
        };
        const badge = badges[status];
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                <Icon className="w-3 h-3" />
                {badge.text}
            </span>
        );
    };

    const generateLegalReport = () => {
        return `SIGNALEMENT POUR DIFFAMATION MÉDICALE

Date: ${new Date().toLocaleDateString('fr-FR')}

Établissement concerné: ${selectedAlert?.review.author}

MOTIFS DU SIGNALEMENT:
- Violation du secret médical (Article 226-13 du Code pénal)
- Diffamation médicale (Article 29 de la loi du 29 juillet 1881)
- Atteinte à la réputation professionnelle

AVIS LITIGIEUX:
"${selectedAlert?.review.text}"

DEMANDE:
Nous demandons le retrait immédiat de cet avis conformément aux articles précités et à la jurisprudence en vigueur concernant la protection du secret médical et de la réputation professionnelle.

Signature: [Cabinet Médical]`;
    };

    return (
        <div className="p-8">
            {/* Loading State */}
            {(alertsLoading || settingsLoading) && (
                <LoadingSpinner text="Chargement des alertes..." />
            )}

            {!alertsLoading && !settingsLoading && (
                <>
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Centre de Commandement - Alertes</h1>
                        <p className="text-slate-600">Configurez vos seuils d'alerte et gérez les crises de réputation en temps réel</p>
                    </div>

                    {/* Configuration Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldAlert className="w-5 h-5 text-medical-600" />
                            <h2 className="text-lg font-semibold text-slate-900">Configuration des Triggers</h2>
                        </div>

                        {/* Rating Threshold */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Alerter si la note est inférieure à :
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={settings.rating_threshold || 2}
                                    onChange={(e) => handleRatingThresholdChange(e.target.value)}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600"
                                />
                                <div className="flex items-center gap-1 bg-medical-50 px-4 py-2 rounded-lg border border-medical-200">
                                    <span className="text-2xl font-bold text-medical-600">{settings.rating_threshold || 2}</span>
                                    <span className="text-sm text-medical-600">★</span>
                                </div>
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Mots-clés sensibles
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                                    placeholder="Ajouter un mot-clé..."
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
                                />
                                <button
                                    onClick={addKeyword}
                                    className="px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Ajouter
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(settings.critical_keywords || []).map((keyword) => (
                                    <span
                                        key={keyword}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm"
                                    >
                                        {keyword}
                                        <button onClick={() => removeKeyword(keyword)} className="hover:text-red-600">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Notification Channels */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Canaux de Notification
                            </label>
                            <div className="space-y-3">
                                {/* Email */}
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-slate-600" />
                                        <div>
                                            <p className="font-medium text-slate-900">Email</p>
                                            <p className="text-xs text-slate-600">Notifications par email</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleNotification('email')}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.email_enabled ? 'bg-medical-600' : 'bg-slate-300'
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.email_enabled ? 'translate-x-6' : ''
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* SMS */}
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-slate-600" />
                                        <div>
                                            <p className="font-medium text-slate-900 flex items-center gap-2">
                                                SMS d'urgence
                                                <span className="px-2 py-0.5 bg-gradient-to-r from-medical-500 to-medical-600 text-white text-xs rounded-full">
                                                    Premium
                                                </span>
                                            </p>
                                            <p className="text-xs text-slate-600">Alertes SMS instantanées</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleNotification('sms')}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.sms_enabled ? 'bg-medical-600' : 'bg-slate-300'
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.sms_enabled ? 'translate-x-6' : ''
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* WhatsApp */}
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-slate-600" />
                                        <div>
                                            <p className="font-medium text-slate-900 flex items-center gap-2">
                                                WhatsApp Business
                                                <span className="px-2 py-0.5 bg-gradient-to-r from-medical-500 to-medical-600 text-white text-xs rounded-full">
                                                    Premium
                                                </span>
                                            </p>
                                            <p className="text-xs text-slate-600">Notifications WhatsApp</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleNotification('whatsapp')}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.whatsapp_enabled ? 'bg-medical-600' : 'bg-slate-300'
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.whatsapp_enabled ? 'translate-x-6' : ''
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts History */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-medical-600" />
                                <h2 className="text-lg font-semibold text-slate-900">Historique des Alertes</h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                            Source
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                            Motif
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {alerts.map((alert) => (
                                        <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                {alert.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {alert.source}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-900">
                                                {alert.reason}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(alert.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {alert.status === 'critical' && (
                                                    <button
                                                        onClick={() => openCrisisModal(alert)}
                                                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                                                    >
                                                        Gérer la crise
                                                    </button>
                                                )}
                                                {alert.status === 'surveillance' && (
                                                    <button className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-xs font-medium">
                                                        Voir détails
                                                    </button>
                                                )}
                                                {alert.status === 'resolved' && (
                                                    <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium">
                                                        Archivé
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Crisis Management Modal */}
                    {showCrisisModal && selectedAlert && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                            <ShieldAlert className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Protocole de Gestion de Crise</h2>
                                            <p className="text-sm text-slate-600">Avis critique détecté</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowCrisisModal(false)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 space-y-6">
                                    {/* Review Summary */}
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm font-semibold text-red-900 mb-2">Avis Litigieux:</p>
                                        <p className="text-sm text-red-800 mb-2">Auteur: {selectedAlert.review.author}</p>
                                        <p className="text-sm text-red-700 italic">"{selectedAlert.review.text}"</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="text-xs text-red-600">Note:</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < selectedAlert.review.rating ? 'text-red-500' : 'text-slate-300'}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => {
                                                const report = generateLegalReport();
                                                navigator.clipboard.writeText(report);
                                                alert('Signalement copié dans le presse-papiers !');
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                                        >
                                            <FileText className="w-5 h-5" />
                                            Générer Signalement Juridique
                                        </button>

                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors font-medium">
                                            <MessageSquare className="w-5 h-5" />
                                            Réponse Medical-Safe
                                        </button>
                                    </div>

                                    {/* Legal Info */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-slate-700 mb-2">⚖️ Références Juridiques:</p>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                            <li>• Article 226-13 du Code pénal (Secret médical)</li>
                                            <li>• Article 29 de la loi du 29 juillet 1881 (Diffamation)</li>
                                            <li>• Code de Déontologie Médicale (Protection réputation)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AlertsPage;
