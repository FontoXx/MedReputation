import React, { useState } from 'react';
import { Plus, MapPin, Phone, Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';

const AddClinicForm = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        google_place_id: '',
        address: '',
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validation
            if (!formData.name.trim()) {
                throw new Error('Le nom du cabinet est requis');
            }

            // Appeler la fonction onAdd (qui utilisera Supabase)
            const result = await onAdd(formData);

            if (result.error) {
                throw new Error(result.error);
            }

            setSuccess(true);

            // Réinitialiser le formulaire après 1.5s
            setTimeout(() => {
                setFormData({
                    name: '',
                    google_place_id: '',
                    address: '',
                    phone: '',
                    email: ''
                });
                setSuccess(false);
                onClose && onClose();
            }, 1500);

        } catch (err) {
            console.error('Error adding clinic:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-medical-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Ajouter un Cabinet</h3>
                    <p className="text-sm text-slate-600">Importez un nouveau cabinet médical</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom du cabinet <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Cabinet Dr. Dupont"
                        required
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    />
                </div>

                {/* Google Place ID */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Google Place ID
                        <span className="ml-2 text-xs text-slate-500">(optionnel)</span>
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="google_place_id"
                            value={formData.google_place_id}
                            onChange={handleChange}
                            placeholder="ChIJN1t_tDeuEmsRUsoyG_..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        💡 Permet l'import automatique des avis Google
                    </p>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Adresse
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Rue de la Santé, 75014 Paris"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Téléphone
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="01 23 45 67 89"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="contact@cabinet.fr"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-700">Cabinet ajouté avec succès !</p>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Ajout en cours...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Ajouter le cabinet
                            </>
                        )}
                    </button>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>📌 Prochaine étape :</strong> Après ajout, vous pourrez importer les avis depuis Google Maps
                    via le Google Place ID (scraper à connecter).
                </p>
            </div>
        </div>
    );
};

export default AddClinicForm;
