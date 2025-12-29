import React from 'react';
import { Activity, TrendingUp, AlertCircle } from 'lucide-react';

const Header = ({ practiceName, reputationHealth }) => {
    const getHealthColor = () => {
        if (reputationHealth === 'Excellente') return 'text-green-600 bg-green-50';
        if (reputationHealth === 'Bonne') return 'text-medical-600 bg-medical-50';
        if (reputationHealth === 'À surveiller') return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    const getHealthIcon = () => {
        if (reputationHealth === 'Excellente') return TrendingUp;
        if (reputationHealth === 'À surveiller') return AlertCircle;
        return Activity;
    };

    const HealthIcon = getHealthIcon();

    return (
        <div className="bg-white border-b border-slate-200 px-8 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{practiceName}</h2>
                    <p className="text-sm text-slate-600">Veille Médicale de Réputation</p>
                </div>

                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl ${getHealthColor()}`}>
                    <HealthIcon className="w-5 h-5" />
                    <div>
                        <p className="text-xs font-medium opacity-75">Santé de la Réputation</p>
                        <p className="text-sm font-bold">{reputationHealth}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
