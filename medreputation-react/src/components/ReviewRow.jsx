import React, { useState } from 'react';
import {
    Star,
    AlertTriangle,
    Shield,
    MessageSquare,
    Flag,
    Archive,
    Sparkles,
    Loader2,
    Check
} from 'lucide-react';
import { medReputationAPI } from '../services/api';

const ReviewRow = ({ review, onArchive, onUnarchive, isArchived = false }) => {
    const [showReply, setShowReply] = useState(false);
    const [generatedReply, setGeneratedReply] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [flagged, setFlagged] = useState(false);

    const generateSmartReply = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await medReputationAPI.generateResponse(
                review.text,
                review.rating,
                review.practiceName,
                review.phone
            );

            setGeneratedReply(response.response);
            setShowReply(true);
        } catch (err) {
            setError('Erreur: Assurez-vous que le backend est lancé (port 8000)');
            console.error('API Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedReply);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Erreur copie:', err);
        }
    };

    const handleFlag = () => {
        setFlagged(true);
        setTimeout(() => setFlagged(false), 2000);
        // TODO: Envoyer au backend pour sauvegarde
    };

    const handleArchiveClick = () => {
        if (isArchived) {
            onUnarchive(review.id);
        } else {
            onArchive(review.id);
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'text-green-600';
        if (rating >= 3) return 'text-orange-500';
        return 'text-red-600';
    };

    const getPriorityBadge = () => {
        if (review.hasSensitiveContent) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Critique
                </span>
            );
        }
        if (review.rating <= 2) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Urgent
                </span>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating
                                        ? 'fill-current ' + getRatingColor(review.rating)
                                        : 'text-slate-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                            {review.author}
                        </span>
                        <span className="text-xs text-slate-400">{review.date}</span>
                    </div>
                    {getPriorityBadge()}
                </div>
            </div>

            {/* Review Text */}
            <p className="text-slate-700 leading-relaxed mb-4">{review.text}</p>

            {/* AI Medical Guard */}
            {review.hasSensitiveContent && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-900 mb-1">
                                AI Medical Guard - Contenu Sensible Détecté
                            </p>
                            <p className="text-sm text-red-700">
                                {review.sensitiveItems.join(', ')}
                            </p>
                            <p className="text-xs text-red-600 mt-2">
                                ⚠️ Utiliser uniquement les réponses Medical-Safe
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                    onClick={generateSmartReply}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Génération IA...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Réponse Medical-Safe
                        </>
                    )}
                </button>

                <button
                    onClick={handleFlag}
                    disabled={flagged}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${flagged
                        ? 'border-orange-300 bg-orange-50 text-orange-700'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    {flagged ? (
                        <>
                            <Check className="w-4 h-4" />
                            Signalé
                        </>
                    ) : (
                        <>
                            <Flag className="w-4 h-4" />
                            Signaler
                        </>
                    )}
                </button>

                <button
                    onClick={handleArchiveClick}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${isArchived
                            ? 'border-medical-300 bg-medical-50 text-medical-700 hover:bg-medical-100'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    <Archive className="w-4 h-4" />
                    {isArchived ? 'Désarchiver' : 'Archiver'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                    <p className="text-xs text-red-600 mt-1">
                        💡 Lancez le backend: <code className="bg-red-100 px-1 rounded">cd backend && uvicorn main:app --reload</code>
                    </p>
                </div>
            )}

            {/* Generated Reply */}
            {showReply && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-green-900 mb-1">
                                    Réponse Générée (Conforme Déontologie)
                                </p>
                                <div className="bg-white rounded-lg p-3 text-sm text-slate-700 whitespace-pre-line">
                                    {generatedReply}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={copyToClipboard}
                                className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${copied
                                    ? 'bg-green-700 text-white'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {copied ? (
                                    <span className="flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Copié !
                                    </span>
                                ) : (
                                    'Copier la réponse'
                                )}
                            </button>
                            <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium">
                                Modifier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewRow;
