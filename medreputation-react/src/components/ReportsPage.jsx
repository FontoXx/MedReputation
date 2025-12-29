import React, { useState } from 'react';
import {
    FileText,
    TrendingUp,
    Users,
    Target,
    Download,
    Award,
    AlertCircle,
    CheckCircle,
    TrendingDown,
    MapPin,
    Clock
} from 'lucide-react';
import { useReports } from '../hooks/useSupabase';
import { LoadingSpinner } from './LoadingSkeleton';

const ReportsPage = ({ selectedPractice }) => {
    // Hook Supabase
    const { reports, loading } = useReports(selectedPractice);

    // Valeurs par défaut si pas de rapports
    const latestReport = reports?.[0] || {};
    const [complianceScore] = useState(latestReport.compliance_score || 0);
    const [responseRate] = useState(latestReport.response_rate || 0);

    // Données par service
    const serviceData = [
        { name: 'Accueil / Secrétariat', rating: 4.2, sentiment: 'Positif', score: 84, trend: 'up' },
        { name: 'Chirurgie / Praticiens', rating: 4.8, sentiment: 'Excellent', score: 96, trend: 'up' },
        { name: 'Hygiène & Locaux', rating: 4.5, sentiment: 'Très Bien', score: 90, trend: 'stable' },
        { name: 'Temps d\'attente', rating: 3.2, sentiment: 'À améliorer', score: 64, trend: 'down' }
    ];

    // Benchmarking concurrentiel
    const competitors = [
        { name: 'Cabinet Dr. Dupont', rating: 4.5, reviewCount: 342, responseTime: '18h', isCurrent: true },
        { name: 'Clinique Saint-Michel', rating: 4.2, reviewCount: 521, responseTime: '36h', isCurrent: false },
        { name: 'Centre Médical Pasteur', rating: 4.7, reviewCount: 289, responseTime: '12h', isCurrent: false },
        { name: 'Polyclinique Moderne', rating: 4.1, reviewCount: 456, responseTime: '48h', isCurrent: false }
    ];

    // Jauge circulaire
    const CircularProgress = ({ percentage, size = 120 }) => {
        const radius = (size - 10) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return (
            <div className="relative inline-flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#E2E8F0"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#0D9488"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{percentage}%</span>
                </div>
            </div>
        );
    };

    const getSentimentColor = (sentiment) => {
        if (sentiment === 'Excellent') return 'text-green-600 bg-green-50';
        if (sentiment === 'Très Bien' || sentiment === 'Positif') return 'text-blue-600 bg-blue-50';
        return 'text-orange-600 bg-orange-50';
    };

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
        return <div className="w-4 h-4 border-b-2 border-slate-400" />;
    };

    const generatePDF = () => {
        alert('Génération du rapport PDF en cours... (Fonctionnalité démo)');
    };

    if (loading) {
        return (
            <div className="p-8">
                <LoadingSpinner text="Chargement des rapports..." />
            </div>
        );
    }

    if (!selectedPractice) {
        return (
            <div className="p-8">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                    <p className="text-slate-600">Sélectionnez un cabinet pour voir les rapports</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Audit de Performance et Conformité
                    </h1>
                    <p className="text-slate-600">
                        Analyse consolidée pour le conseil d'administration
                    </p>
                </div>
                <button
                    onClick={generatePDF}
                    className="flex items-center gap-2 px-6 py-3 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors font-medium shadow-sm"
                >
                    <Download className="w-5 h-5" />
                    Générer le rapport PDF
                </button>
            </div>

            {/* Score Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Compliance Score */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-medical-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Score de Conformité Global</h2>
                            <p className="text-sm text-slate-600">Déontologie médicale & Secret professionnel</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                        <CircularProgress percentage={complianceScore} size={160} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-green-900">Aucune violation détectée</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Objectif: 100%</span>
                            </div>
                            <span className="text-sm text-blue-700">Atteint à 98%</span>
                        </div>
                    </div>
                </div>

                {/* Response Rate */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Taux de Réponse aux Avis Critiques</h2>
                            <p className="text-sm text-slate-600">Réactivité sur les notes ≤ 3★</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                        <CircularProgress percentage={responseRate} size={160} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Délai moyen de réponse</span>
                            <span className="text-sm font-bold text-slate-900">18h</span>
                        </div>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-xs font-medium text-orange-900">
                                🎯 Objectif : 100% de réponses sous 48h
                            </p>
                            <p className="text-xs text-orange-700 mt-1">
                                6% des avis critiques en attente de traitement
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analyse par Service */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-5 h-5 text-medical-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Analyse de Sentiment par Service</h2>
                </div>

                <div className="space-y-4">
                    {serviceData.map((service, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-medical-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-slate-900">{service.name}</span>
                                    {getTrendIcon(service.trend)}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(service.sentiment)}`}>
                                        {service.sentiment}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-bold text-slate-900">{service.rating}</span>
                                        <span className="text-sm text-slate-500">/5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${service.score >= 90 ? 'bg-green-500' :
                                        service.score >= 70 ? 'bg-blue-500' :
                                            'bg-orange-500'
                                        }`}
                                    style={{ width: `${service.score}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-slate-500">Score de satisfaction</span>
                                <span className="text-xs font-medium text-slate-700">{service.score}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benchmarking */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-medical-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Positionnement Concurrentiel</h2>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        Zone 5km
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b-2 border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Établissement
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Note Moyenne
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Volume d'avis
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Temps de réponse
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Position
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {competitors.map((competitor, index) => (
                                <tr
                                    key={index}
                                    className={competitor.isCurrent ? 'bg-medical-50 border-l-4 border-medical-600' : 'hover:bg-slate-50'}
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            {competitor.isCurrent && (
                                                <Award className="w-4 h-4 text-medical-600" />
                                            )}
                                            <span className={`font-medium ${competitor.isCurrent ? 'text-medical-900' : 'text-slate-900'}`}>
                                                {competitor.name}
                                            </span>
                                            {competitor.isCurrent && (
                                                <span className="px-2 py-0.5 bg-medical-600 text-white text-xs rounded-full">
                                                    Vous
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-lg font-bold text-slate-900">{competitor.rating}</span>
                                            <span className="text-yellow-500">★</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-slate-700">{competitor.reviewCount}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${parseInt(competitor.responseTime) <= 24
                                            ? 'bg-green-100 text-green-700'
                                            : parseInt(competitor.responseTime) <= 36
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {competitor.responseTime}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-lg font-bold text-slate-900">#{index + 1}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-medical-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Recommandations de l'IA</h2>
                        <p className="text-slate-300 text-sm">Analyse prédictive basée sur 342 avis patients</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium mb-2">Point de friction principal identifié</p>
                                <p className="text-sm text-slate-300">
                                    L'attente au secrétariat le lundi matin est le principal point de friction ce mois-ci.
                                    <span className="text-orange-400 font-medium"> 8 mentions négatives</span> sur ce créneau spécifique.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium mb-2">Forces à capitaliser</p>
                                <p className="text-sm text-slate-300">
                                    La qualité de l'écoute des praticiens est unanimement saluée (96% d'avis positifs).
                                    <span className="text-green-400 font-medium"> Excellente image médecin-patient</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium mb-2">Action prioritaire recommandée</p>
                                <p className="text-sm text-slate-300">
                                    Optimiser la gestion des rendez-vous le lundi matin. Suggestion :
                                    <span className="text-blue-400 font-medium"> ajouter 1 personne au secrétariat ce jour-là</span>
                                    pour réduire le délai de 32%.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-xs text-slate-400">
                        💡 Analyse générée par l'IA MedReputation le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
