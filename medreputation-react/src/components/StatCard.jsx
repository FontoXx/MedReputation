import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';

const StatCard = ({ title, value, subtitle, trend, icon: Icon, alert }) => {
    const getTrendColor = () => {
        if (alert) return 'text-red-600';
        if (trend === 'up') return 'text-green-600';
        if (trend === 'down') return 'text-red-600';
        return 'text-slate-600';
    };

    const getTrendIcon = () => {
        if (alert) return AlertTriangle;
        if (trend === 'up') return TrendingUp;
        if (trend === 'down') return TrendingDown;
        return null;
    };

    const TrendIcon = getTrendIcon();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
                        {TrendIcon && (
                            <TrendIcon className={`w-5 h-5 ${getTrendColor()}`} />
                        )}
                    </div>
                    {subtitle && (
                        <p className={`text-sm mt-2 ${alert ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg ${alert ? 'bg-red-50' : 'bg-medical-50'}`}>
                        <Icon className={`w-6 h-6 ${alert ? 'text-red-600' : 'text-medical-600'}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
