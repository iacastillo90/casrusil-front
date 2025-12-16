'use client';

import { useEffect, useState } from 'react';
import { Leaf, Award, ArrowUpRight } from 'lucide-react';
import { useSustainabilityStore } from '../stores/sustainability.store';
import { Card } from "@/components/ui/card";

export function EcoScoreCard() {
    const { carbonScore, scoreLevel, fetchSustainabilityData } = useSustainabilityStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchSustainabilityData();
    }, [fetchSustainabilityData]);

    if (!mounted) return null;

    const isHigh = carbonScore >= 70;
    const scoreColor = isHigh ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400";
    const strokeColor = isHigh ? "#10b981" : "#f59e0b"; // Tailwind emerald-500 vs amber-500

    return (
        <Card className="rounded-2xl p-6 border-2 border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-500 relative overflow-hidden bg-white dark:bg-slate-900 h-full">
            {/* Fondo decorativo */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 ${isHigh ? 'bg-emerald-500' : 'bg-amber-500'}`} />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Leaf className={`w-5 h-5 ${isHigh ? 'text-emerald-500' : 'text-amber-500'}`} />
                    Pasaporte Verde
                </h3>
                {isHigh && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        <Award className="w-3 h-3" /> CERTIFICADO
                    </span>
                )}
            </div>

            {/* Gráfico SVG Animado */}
            <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 128 128">
                    {/* Fondo */}
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-slate-800" />
                    {/* Progreso */}
                    <circle cx="64" cy="64" r="56" stroke={strokeColor} strokeWidth="8" fill="none" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - carbonScore / 100)}`}
                        className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${scoreColor}`}>{carbonScore}</span>
                    <span className="text-xs text-slate-400 font-bold">/ 100</span>
                </div>
            </div>

            <div className="text-center relative z-10">
                <div className={`text-sm font-bold mb-1 ${scoreColor}`}>
                    {scoreLevel}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    <span>Mejor que el 65% de tu industria</span>
                </div>
            </div>
        </Card>
    );
}
