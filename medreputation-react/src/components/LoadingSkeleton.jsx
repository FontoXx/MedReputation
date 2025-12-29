import React from 'react';

/**
 * Composant Skeleton pour le chargement des stats cards
 */
export const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
    </div>
);

/**
 * Composant Skeleton pour le chargement des avis
 */
export const ReviewSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-slate-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-32"></div>
            </div>
        </div>
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
        <div className="flex gap-2">
            <div className="h-10 bg-slate-200 rounded-lg w-40"></div>
            <div className="h-10 bg-slate-200 rounded-lg w-24"></div>
        </div>
    </div>
);

/**
 * Composant de chargement générique avec spinner
 */
export const LoadingSpinner = ({ size = 'md', text = 'Chargement...' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`${sizeClasses[size]} border-4 border-slate-200 border-t-medical-600 rounded-full animate-spin`}></div>
            {text && <p className="mt-4 text-sm text-slate-600">{text}</p>}
        </div>
    );
};

/**
 * État vide pour quand il n'y a pas de données
 */
export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        {Icon && (
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-slate-400" />
            </div>
        )}
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{description}</p>
        {action}
    </div>
);

