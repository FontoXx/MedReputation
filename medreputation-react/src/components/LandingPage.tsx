import React, { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { Shield, Bell, FileText, TrendingUp, ArrowRight, Star, Building2, CheckCircle2, Menu, X } from 'lucide-react';
import SectionSkeleton from './landing/SectionSkeleton';

// Lazy load below-the-fold sections for code splitting
const PricingSection = lazy(() => import('./landing/PricingSection'));
const TestimonialsSection = lazy(() => import('./landing/TestimonialsSection'));

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <LazyMotion features={domAnimation} strict>
            <div className="min-h-screen bg-slate-50 overflow-hidden">
                {/* Simplified Blurry Blobs Background - Reduced from 3 to 2 */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-medical-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-blue-400/10 rounded-full blur-3xl" />
                </div>

                {/* Navigation */}
                <m.nav
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50"
                >
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-medical-600 to-medical-700 rounded-xl flex items-center justify-center shadow-lg shadow-medical-600/30">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-medical-700 to-medical-600 bg-clip-text text-transparent">
                                    MedReputation
                                </span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#produit" className="text-slate-700 hover:text-medical-600 transition-colors font-medium">
                                    Produit
                                </a>
                                <a href="#tarifs" className="text-slate-700 hover:text-medical-600 transition-colors font-medium">
                                    Tarifs
                                </a>
                                <a href="#temoignages" className="text-slate-700 hover:text-medical-600 transition-colors font-medium">
                                    Témoignages
                                </a>
                            </div>

                            {/* CTA Buttons */}
                            <div className="hidden md:flex items-center gap-3">
                                <Link to="/dashboard" className="px-5 py-2.5 text-slate-700 hover:text-medical-600 font-medium transition-colors">
                                    Connexion
                                </Link>
                                <Link to="/dashboard" className="px-5 py-2.5 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-medical-600/30 transition-all">
                                    Essai Gratuit
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-slate-700"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <m.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="md:hidden pt-4 pb-2 space-y-3"
                            >
                                <a href="#produit" className="block py-2 text-slate-700 hover:text-medical-600 font-medium">
                                    Produit
                                </a>
                                <a href="#tarifs" className="block py-2 text-slate-700 hover:text-medical-600 font-medium">
                                    Tarifs
                                </a>
                                <a href="#temoignages" className="block py-2 text-slate-700 hover:text-medical-600 font-medium">
                                    Témoignages
                                </a>
                                <div className="flex flex-col gap-2 pt-2">
                                    <Link to="/dashboard" className="px-5 py-2.5 text-slate-700 border border-slate-300 rounded-xl font-medium text-center">
                                        Connexion
                                    </Link>
                                    <Link to="/dashboard" className="px-5 py-2.5 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium text-center">
                                        Essai Gratuit
                                    </Link>
                                </div>
                            </m.div>
                        )}
                    </div>
                </m.nav>

                {/* Hero Section */}
                <section className="relative pt-20 pb-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-4xl mx-auto mb-16">
                            <m.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-5xl md:text-7xl font-bold leading-tight mb-6"
                            >
                                Votre{' '}
                                <span className="bg-gradient-to-r from-medical-600 via-medical-500 to-medical-700 bg-clip-text text-transparent">
                                    réputation médicale
                                </span>{' '}
                                est votre actif le plus précieux.
                            </m.h1>

                            <m.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-xl md:text-2xl text-slate-600 mb-10"
                            >
                                Gérez vos avis Google Maps avec une IA formée à la déontologie médicale.
                            </m.p>

                            <m.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                            >
                                <Link to="/dashboard" className="group px-8 py-4 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-medical-600/30 hover:shadow-2xl hover:shadow-medical-600/40 transition-all flex items-center gap-2">
                                    Commencer gratuitement
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold text-lg border border-slate-300 hover:border-medical-600 hover:text-medical-600 transition-all">
                                    Voir la démo
                                </button>
                            </m.div>

                            {/* Simplified Dashboard Mockup */}
                            <m.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="relative"
                            >
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/50 p-6">
                                        {/* Mini Dashboard Preview */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                En direct
                                            </div>
                                        </div>

                                        {/* KPI Cards Preview */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            {[
                                                { label: 'Indice de Confiance', value: '87/100' },
                                                { label: 'Avis Non Répondus', value: '3' },
                                                { label: 'Taux de Réponse', value: '94%' },
                                                { label: 'Alertes Critiques', value: '0' }
                                            ].map((stat, idx) => (
                                                <div key={idx} className="bg-white rounded-xl border border-slate-200/50 p-4">
                                                    <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Review Card Preview */}
                                        <div className="bg-white rounded-xl border border-slate-200/50 p-5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-100 to-medical-200 flex items-center justify-center">
                                                    <span className="text-medical-700 font-semibold">M</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-slate-900">Marie D.</span>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        Excellent accueil et professionnalisme. Je recommande vivement ce cabinet.
                                                    </p>
                                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <CheckCircle2 className="w-4 h-4 text-medical-600" />
                                                            Réponse IA validée par déontologie
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid - Features */}
                <section id="produit" className="relative py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                Une plateforme{' '}
                                <span className="bg-gradient-to-r from-medical-600 to-medical-700 bg-clip-text text-transparent">
                                    pensée pour vous
                                </span>
                            </h2>
                            <p className="text-xl text-slate-600">
                                Toutes les fonctionnalités dont vous avez besoin pour protéger votre réputation
                            </p>
                        </m.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: Shield,
                                    title: 'IA Medical-Safe',
                                    description: 'Intelligence artificielle formée spécifiquement à la déontologie médicale française pour des réponses conformes.',
                                    gradient: 'from-medical-500 to-medical-700',
                                    delay: 0.1
                                },
                                {
                                    icon: Bell,
                                    title: 'Alertes Instantanées',
                                    description: 'Notifications en temps réel pour tout nouvel avis critique nécessitant une attention immédiate.',
                                    gradient: 'from-orange-500 to-orange-700',
                                    delay: 0.2
                                },
                                {
                                    icon: FileText,
                                    title: 'Rapports de Conformité',
                                    description: 'Génération automatique de rapports détaillés pour prouver votre respect des obligations légales.',
                                    gradient: 'from-blue-500 to-blue-700',
                                    delay: 0.3
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Analyse Concurrentielle',
                                    description: 'Benchmarking intelligent de votre réputation par rapport aux cabinets de votre zone géographique.',
                                    gradient: 'from-purple-500 to-purple-700',
                                    delay: 0.4
                                }
                            ].map((feature, idx) => (
                                <m.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: feature.delay }}
                                    className="group relative bg-white rounded-2xl border border-slate-200/50 p-8 hover:border-medical-300 transition-all hover:shadow-xl hover:shadow-medical-600/10"
                                >
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                </m.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Lazy-loaded Pricing Section */}
                <Suspense fallback={<SectionSkeleton />}>
                    <PricingSection />
                </Suspense>

                {/* Trust Section */}
                <section className="relative py-20 px-6 bg-white/50">
                    <div className="max-w-7xl mx-auto">
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-12"
                        >
                            <p className="text-sm font-semibold text-medical-600 mb-2 uppercase tracking-wider">
                                Ils nous font confiance
                            </p>
                            <h3 className="text-3xl font-bold text-slate-900">
                                Rejoignez plus de 200 cabinets médicaux
                            </h3>
                        </m.div>

                        <m.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center gap-12 md:gap-16"
                        >
                            {[
                                'Clinique Saint-Jean',
                                'Cabinet Médical Pasteur',
                                'Centre de Santé Gambetta',
                                'Polyclinique du Parc',
                                'Maison Médicale Victor Hugo',
                                'Cabinet Dr. Dupont'
                            ].map((clinic, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 text-slate-400 hover:text-medical-600 transition-colors"
                                >
                                    <Building2 className="w-6 h-6" />
                                    <span className="font-semibold text-lg">{clinic}</span>
                                </div>
                            ))}
                        </m.div>
                    </div>
                </section>

                {/* Lazy-loaded Testimonials Section */}
                <Suspense fallback={<SectionSkeleton />}>
                    <TestimonialsSection />
                </Suspense>

                {/* CTA Section */}
                <section className="relative py-24 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-gradient-to-br from-medical-600 to-medical-700 rounded-3xl p-12 md:p-16 shadow-2xl shadow-medical-600/30"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Prêt à protéger votre réputation&nbsp;?
                            </h2>
                            <p className="text-xl text-medical-50 mb-8">
                                Essayez MedReputation gratuitement pendant 14 jours. Sans carte bancaire.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/dashboard" className="px-8 py-4 bg-white text-medical-700 rounded-2xl font-semibold text-lg hover:bg-slate-50 transition-all shadow-xl">
                                    Démarrer l'essai gratuit
                                </Link>
                                <button className="px-8 py-4 bg-medical-800 text-white rounded-2xl font-semibold text-lg hover:bg-medical-900 transition-all">
                                    Planifier une démo
                                </button>
                            </div>
                        </m.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative py-12 px-6 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-medical-600 to-medical-700 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold bg-gradient-to-r from-medical-700 to-medical-600 bg-clip-text text-transparent">
                                    MedReputation
                                </span>
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                                <a href="#" className="text-slate-600 hover:text-medical-600 transition-colors">
                                    À propos
                                </a>
                                <a href="#" className="text-slate-600 hover:text-medical-600 transition-colors">
                                    Mentions légales
                                </a>
                                <a href="#" className="text-slate-600 hover:text-medical-600 transition-colors">
                                    Confidentialité
                                </a>
                                <a href="#" className="text-slate-600 hover:text-medical-600 transition-colors">
                                    Contact
                                </a>
                            </div>

                            {/* Copyright */}
                            <p className="text-sm text-slate-500">
                                © 2024 MedReputation. Tous droits réservés.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </LazyMotion>
    );
};

export default LandingPage;
