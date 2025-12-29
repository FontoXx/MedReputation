import React from 'react';

const SectionSkeleton = () => {
    return (
        <div className="relative py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="h-12 bg-slate-200 rounded-lg w-2/3 mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-slate-200 rounded-lg w-1/2 mx-auto animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-8">
                            <div className="h-12 bg-slate-200 rounded-lg w-3/4 mb-6 animate-pulse" />
                            <div className="space-y-3 mb-8">
                                <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                                <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
                                <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse" />
                            </div>
                            <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectionSkeleton;
