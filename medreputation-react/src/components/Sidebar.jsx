import React, { useState } from 'react';
import {
    LayoutDashboard,
    Bell,
    FileText,
    BarChart3,
    Building2,
    ChevronDown,
    Plus,
    Trash2,
    LogOut,
    User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ activePage, onPageChange, selectedPractice, onPracticeChange, practices, onAddPractice, onDeletePractice }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const { user, signOut } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
        { id: 'alerts', label: 'Alertes de Réputation', icon: Bell },
        { id: 'templates', label: 'Modèles de Réponses', icon: FileText },
        { id: 'reports', label: 'Rapports de Conformité', icon: BarChart3 },
    ];

    const handleDelete = (practiceId) => {
        if (practices.length <= 1) {
            alert("Vous devez avoir au moins un cabinet");
            return;
        }
        onDeletePractice(practiceId);
        setShowDeleteConfirm(null);
    };

    const handleLogout = async () => {
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            await signOut();
        }
    };

    return (
        <div className="w-64 bg-slate-900 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-medical-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg">MedReputation</h1>
                        <p className="text-slate-400 text-xs">Healthcare Manager</p>
                    </div>
                </div>
            </div>

            {/* Practice Selector */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Cabinet / Praticien
                    </label>
                    <button
                        onClick={onAddPractice}
                        className="p-1.5 bg-medical-600 hover:bg-medical-700 rounded-lg transition-colors"
                        title="Ajouter un cabinet"
                    >
                        <Plus className="w-4 h-4 text-white" />
                    </button>
                </div>

                <div className="relative">
                    <select
                        value={selectedPractice}
                        onChange={(e) => onPracticeChange(e.target.value)}
                        className="w-full bg-slate-800 text-white rounded-lg px-3 py-2.5 pr-8 text-sm font-medium appearance-none cursor-pointer hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-500"
                    >
                        {practices.map((practice) => (
                            <option key={practice.id} value={practice.id}>
                                {practice.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500">
                        {practices.find(p => p.id === parseInt(selectedPractice))?.type}
                    </p>
                    {practices.length > 1 && (
                        <button
                            onClick={() => setShowDeleteConfirm(parseInt(selectedPractice))}
                            className="p-1 hover:bg-slate-800 rounded transition-colors"
                            title="Supprimer ce cabinet"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-400" />
                        </button>
                    )}
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === parseInt(selectedPractice) && (
                    <div className="mt-3 p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg">
                        <p className="text-xs text-red-300 mb-2">Supprimer ce cabinet ?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleDelete(parseInt(selectedPractice))}
                                className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-colors"
                            >
                                Non
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onPageChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-medical-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer - User & Logout */}
            <div className="p-4 border-t border-slate-800 space-y-3">
                {/* User Info */}
                <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-medical-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                            {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
