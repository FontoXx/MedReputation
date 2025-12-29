import React, { useState } from 'react';
import {
    BookOpen,
    UserCheck,
    ShieldCheck,
    Copy,
    Check,
    AlertTriangle,
    Plus,
    Star,
    Clock,
    Shield,
    AlertCircle
} from 'lucide-react';
import { useTemplates } from '../hooks/useSupabase';
import { LoadingSpinner } from './LoadingSkeleton';

const TemplatesPage = ({ selectedPractice }) => {
    // Hook Supabase
    const { templates: supabaseTemplates, loading, addTemplate, updateTemplate, deleteTemplate } = useTemplates(selectedPractice);

    const [activeCategory, setActiveCategory] = useState('thanks');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [testText, setTestText] = useState('');
    const [copied, setCopied] = useState(false);
    const [variables, setVariables] = useState({
        Nom_Patient: 'M./Mme',
        Nom_Cabinet: 'Cabinet Dr. Dupont',
        Service: 'consultation',
        Telephone: '01 23 45 67 89'
    });

    // Catégories de templates
    const categories = [
        { id: 'thanks', label: 'Remerciements', icon: Star, color: 'text-green-600', bgColor: 'bg-green-50' },
        { id: 'delays', label: 'Retards & Attente', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
        { id: 'confidential', label: 'Secret Médical', icon: Shield, color: 'text-red-600', bgColor: 'bg-red-50' },
        { id: 'defamatory', label: 'Injurieux / Faux', icon: AlertCircle, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ];

    // Filtrer les templates Supabase par catégorie active
    const currentTemplates = (supabaseTemplates || []).filter(t => t.category === activeCategory);

    // Mots à risque pour Safe-Check
    const riskyWords = [
        'maladie', 'traitement', 'diagnostic', 'opération', 'chirurgie',
        'médicament', 'prescription', 'pathologie', 'symptôme', 'analyse',
        'résultat', 'examen', 'radio', 'scanner', 'irm', 'cancer', 'diabète',
        'dépression', 'hépatite', 'vih', 'sida'
    ];

    // Détection de mots à risque
    const checkRiskyWords = (text) => {
        const foundRisks = [];
        const textLower = text.toLowerCase();

        riskyWords.forEach(word => {
            if (textLower.includes(word)) {
                foundRisks.push(word);
            }
        });

        return foundRisks;
    };

    const detectedRisks = checkRiskyWords(testText);

    // Copier avec remplacement des variables
    const copyWithVariables = (templateText) => {
        let finalText = templateText;
        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalText = finalText.replace(regex, variables[key]);
        });

        navigator.clipboard.writeText(finalText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Insérer variable dans le texte
    const insertVariable = (varName) => {
        setTestText(testText + `{{${varName}}}`);
    };

    // Highlight variables in template text
    const renderTemplateWithVariables = (text) => {
        const parts = text.split(/(\{\{[^}]+\}\})/g);
        return parts.map((part, index) => {
            if (part.match(/\{\{[^}]+\}\}/)) {
                return (
                    <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    if (loading) {
        return (
            <div className="p-8">
                <LoadingSpinner text="Chargement des modèles..." />
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-medical-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Medical-Safe Library</h1>
                        <p className="text-slate-600">Coffre-fort de réponses conformes à la déontologie médicale</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar - Categories */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-8">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                            Catégories
                        </h3>
                        <div className="space-y-2">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setSelectedTemplate(null);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeCategory === cat.id
                                            ? `${cat.bgColor} ${cat.color} font-medium`
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="flex-1 text-left text-sm">{cat.label}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeCategory === cat.id ? cat.bgColor : 'bg-slate-100'
                                            }`}>
                                            {templates[cat.id]?.length || 0}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legal Badge */}
                        <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-4 h-4 text-medical-600" />
                                <p className="text-xs font-semibold text-slate-700">Conformité Garantie</p>
                            </div>
                            <p className="text-xs text-slate-600">
                                Tous nos modèles respectent le Code de Déontologie Médicale et le secret professionnel.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Templates List */}
                    <div className="space-y-4">
                        {currentTemplates.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                                <p className="text-slate-600 mb-2">Aucun modèle dans cette catégorie</p>
                                <p className="text-sm text-slate-500">Les modèles seront chargés depuis Supabase</p>
                            </div>
                        ) : (
                            currentTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer ${selectedTemplate?.id === template.id
                                        ? 'border-medical-300 ring-2 ring-medical-100'
                                        : 'border-slate-200 hover:border-medical-200'
                                        }`}
                                    onClick={() => setSelectedTemplate(template)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                                    {template.title}
                                                </h3>
                                                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                                                    {template.category}
                                                </span>
                                            </div>
                                            <UserCheck className="w-5 h-5 text-medical-600" />
                                        </div>

                                        <div className="text-sm text-slate-700 whitespace-pre-line font-mono bg-slate-50 p-4 rounded-lg border border-slate-200">
                                            {renderTemplateWithVariables(template.text)}
                                        </div>

                                        {selectedTemplate?.id === template.id && (
                                            <div className="mt-4 pt-4 border-t border-slate-200">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyWithVariables(template.text);
                                                    }}
                                                    className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg transition-colors font-medium ${copied
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-medical-600 text-white hover:bg-medical-700'
                                                        }`}
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-4 h-4" />
                                                            Copié pour Google Maps !
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4" />
                                                            Copier pour Google Maps
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* IA Safe-Check */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-5 h-5 text-medical-600" />
                            <h3 className="text-lg font-semibold text-slate-900">IA Safe-Check</h3>
                            <span className="px-2 py-0.5 bg-medical-100 text-medical-700 text-xs rounded-full font-medium">
                                Vérificateur de Conformité
                            </span>
                        </div>

                        {/* Variable Inserter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Insérer une variable :
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(variables).map((varName) => (
                                    <button
                                        key={varName}
                                        onClick={() => insertVariable(varName)}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        {varName}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Test Textarea */}
                        <textarea
                            value={testText}
                            onChange={(e) => setTestText(e.target.value)}
                            placeholder="Tapez ou collez votre réponse ici pour vérifier sa conformité déontologique..."
                            className="w-full h-40 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 text-sm font-mono resize-none"
                        />

                        {/* Risk Detection */}
                        {detectedRisks.length > 0 && (
                            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-orange-900 mb-2">
                                            ⚠️ Attention : Termes à risque détectés
                                        </p>
                                        <p className="text-sm text-orange-700 mb-2">
                                            Ces mots pourraient enfreindre le secret médical :
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {detectedRisks.map((word, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-orange-600 mt-3">
                                            💡 Conseil : Reformulez en évitant les détails médicaux spécifiques.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {testText && detectedRisks.length === 0 && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600" />
                                    <p className="text-sm font-semibold text-green-900">
                                        ✓ Aucun terme à risque détecté
                                    </p>
                                </div>
                                <p className="text-xs text-green-600 mt-1">
                                    Votre réponse semble conforme au secret médical.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatesPage;
