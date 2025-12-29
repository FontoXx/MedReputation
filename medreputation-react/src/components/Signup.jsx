import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, AlertCircle, Loader2, Heart, CheckCircle } from 'lucide-react';

const Signup = ({ onBackToLogin }) => {
    const { signUp, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            errors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email invalide';
        }

        if (!formData.password) {
            errors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { data, error } = await signUp(
            formData.email,
            formData.password,
            { name: formData.name }
        );

        if (!error && data) {
            setSuccess(true);
            // Auto-redirect après 2 secondes
            setTimeout(() => {
                // L'utilisateur sera automatiquement connecté
            }, 2000);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Effacer l'erreur du champ modifié
        if (formErrors[e.target.name]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: null
            });
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Compte créé !</h2>
                        <p className="text-slate-600 mb-6">
                            Bienvenue sur MedReputation. Vous allez être redirigé vers votre tableau de bord...
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-medical-600" />
                            <span className="text-sm text-slate-600">Chargement...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-100 rounded-2xl mb-4">
                        <Heart className="w-8 h-8 text-medical-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">MedReputation</h1>
                    <p className="text-slate-600">Veille Médicale de Réputation</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Créer un compte</h2>
                    <p className="text-slate-600 mb-6">Commencez à gérer votre réputation</p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nom complet
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Dr. Marie Dupont"
                                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.name ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent`}
                                />
                            </div>
                            {formErrors.name && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email professionnel
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="dr.dupont@cabinet.fr"
                                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent`}
                                />
                            </div>
                            {formErrors.email && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.password ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent`}
                                />
                            </div>
                            {formErrors.password && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.confirmPassword ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent`}
                                />
                            </div>
                            {formErrors.confirmPassword && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                'Créer mon compte'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-500">Déjà inscrit ?</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <button
                        onClick={onBackToLogin}
                        className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                        Se connecter
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    En créant un compte, vous acceptez nos conditions d'utilisation
                </p>
            </div>
        </div>
    );
};

export default Signup;
