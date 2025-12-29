import React from 'react';
import { m } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
    return (
        <section id="temoignages" className="relative py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <m.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Ce que disent{' '}
                        <span className="bg-gradient-to-r from-medical-600 to-medical-700 bg-clip-text text-transparent">
                            nos praticiens
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600">
                        Des professionnels de santé témoignent de leur expérience
                    </p>
                </m.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Testimonial 1 - Dr. Sarah L. */}
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white rounded-2xl border border-slate-200/50 p-8 shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">SL</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">Dr. Sarah L.</h4>
                                <p className="text-sm text-slate-600">Dentiste</p>
                            </div>
                        </div>
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-slate-700 leading-relaxed italic">
                            "Enfin un outil qui comprend que je ne peux pas répondre n'importe quoi à cause du secret médical. L'IA formée à la déontologie est un vrai game-changer pour ma pratique."
                        </p>
                    </m.div>

                    {/* Testimonial 2 - Marc A. */}
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl border border-slate-200/50 p-8 shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">MA</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">Marc A.</h4>
                                <p className="text-sm text-slate-600">Directeur de Clinique</p>
                            </div>
                        </div>
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-slate-700 leading-relaxed italic">
                            "Le rapport de conformité nous a fait gagner 4h de préparation pour notre réunion mensuelle. Les KPIs sont exactement ce dont nous avons besoin pour le conseil d'administration."
                        </p>
                    </m.div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
