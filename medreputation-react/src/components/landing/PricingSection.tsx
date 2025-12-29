import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Shield, Check, Zap, Users } from 'lucide-react';

const PricingSection = () => {
    return (
        <section id="tarifs" className="relative py-20 px-6 bg-white/50">
            <div className="max-w-7xl mx-auto">
                <m.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Tarifs{' '}
                        <span className="bg-gradient-to-r from-medical-600 to-medical-700 bg-clip-text text-transparent">
                            transparents
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600">
                        Choisissez le plan adapté à votre pratique médicale
                    </p>
                </m.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Plan Essentiel */}
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white rounded-2xl border border-slate-200/50 p-8 hover:scale-105 transition-transform duration-300"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Essentiel</h3>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-slate-900">Gratuit</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">Suivi de 1 cabinet</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">Analyse de base</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">5 réponses IA/mois</span>
                            </li>
                        </ul>
                        <Link
                            to="/dashboard"
                            className="block w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-center hover:bg-slate-200 transition-colors"
                        >
                            Commencer
                        </Link>
                    </m.div>

                    {/* Plan Praticien - Popular */}
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative bg-white rounded-2xl border-2 border-medical-600 p-8 hover:scale-105 transition-transform duration-300 shadow-xl shadow-medical-600/10"
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span className="px-4 py-1.5 bg-gradient-to-r from-medical-600 to-medical-700 text-white text-sm font-semibold rounded-full shadow-lg">
                                ⭐ Populaire
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-medical-600 to-medical-700 rounded-xl flex items-center justify-center shadow-lg shadow-medical-600/30">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Praticien</h3>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-slate-900">29€</span>
                            <span className="text-slate-600">/mois</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">Alertes SMS</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">Réponses IA illimitées</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">Tableau de bord de réputation</span>
                            </li>
                        </ul>
                        <Link
                            to="/dashboard"
                            className="block w-full px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-semibold text-center hover:shadow-xl hover:shadow-medical-600/30 transition-all"
                        >
                            Essayer gratuitement
                        </Link>
                    </m.div>

                    {/* Plan Clinique */}
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white rounded-2xl border border-slate-200/50 p-8 hover:scale-105 transition-transform duration-300"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Clinique</h3>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-slate-900">99€</span>
                            <span className="text-slate-600">/mois</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">Multi-utilisateurs</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">Rapports de conformité pour le conseil d'administration</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600">Analyse de la concurrence</span>
                            </li>
                        </ul>
                        <Link
                            to="/dashboard"
                            className="block w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold text-center hover:bg-purple-700 transition-colors"
                        >
                            Contacter les ventes
                        </Link>
                    </m.div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
