'use client';

import { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, ShieldAlert, ArrowRight, Calendar } from 'lucide-react';
import { formatCLP } from '@/lib/formatters';
import { financialShieldService } from '../services/financial-shield.service';
import { CashFlowHealth } from '../types/financial-shield.types';
import { Skeleton } from '@/components/ui/skeleton';
import { CelebrationOverlay } from '@/components/shared/CelebrationOverlay';

export function FinancialShieldWidget() {
    const [health, setHealth] = useState<CashFlowHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        financialShieldService.getHealth().then(data => {
            setHealth(data);
            setLoading(false);
        });
    }, []);

    const handleAction = () => {
        setShowCelebration(true);
    };

    if (loading || !health) return <Skeleton className="h-[320px] w-full rounded-2xl" />;

    const isCritical = health.status === 'CRITICAL' || health.status === 'WARNING';
    const primaryOffer = health.offers[0];
    const daysUntilRunway = health.runwayEnd
        ? Math.ceil((new Date(health.runwayEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 30;

    return (
        <>
            <CelebrationOverlay show={showCelebration} onClose={() => setShowCelebration(false)} />

            <div className={`
                relative overflow-hidden rounded-2xl p-6 text-white col-span-full shadow-2xl group transition-all duration-500
                bg-gradient-to-br ${isCritical ? 'from-rose-600 via-orange-600 to-amber-600' : 'from-emerald-500 via-teal-600 to-cyan-600'}
            `}>
                {/* Efecto de Fondo Animado */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-110" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl shadow-inner">
                                {isCritical
                                    ? <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
                                    : <ShieldCheck className="w-8 h-8 text-white" />
                                }
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                    Escudo Financiero
                                    <span className={`inline-block w-3 h-3 rounded-full animate-pulse ${isCritical ? 'bg-red-400' : 'bg-green-400'}`} />
                                </h3>
                                <p className="text-white/80 text-sm font-medium">IA Predictiva • Monitoreo 24/7</p>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 shadow-lg tracking-wider">
                            {isCritical ? 'ALERTA ACTIVA' : 'PROTEGIDO'}
                        </div>
                    </div>

                    {/* Grid de Información (Glassmorphism) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                        {/* Tarjeta Diagnóstico */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
                            <div className="text-xs text-white/70 font-bold uppercase tracking-wider mb-1">Proyección 30 días</div>
                            <div className="text-4xl font-black tracking-tight mb-2" suppressHydrationWarning>
                                {formatCLP(health.projectedBalance30Days)}
                            </div>
                            {isCritical ? (
                                <div className="flex items-center gap-2 text-white/90 bg-red-500/30 px-3 py-1.5 rounded-lg w-fit">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-bold">Quiebre en {daysUntilRunway} días</span>
                                </div>
                            ) : (
                                <div className="text-sm text-emerald-100 flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" /> Flujo saludable proyectado
                                </div>
                            )}
                        </div>

                        {/* Tarjeta Solución */}
                        {primaryOffer && (
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:bg-white/20 transition-colors relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-white/20 px-2 py-1 rounded-bl-lg text-[10px] font-bold">RECOMENDADO</div>

                                <div className="text-xs text-white/70 font-bold uppercase tracking-wider mb-1">Solución Inteligente</div>
                                <div className="text-xl font-bold leading-tight mb-1">
                                    {primaryOffer.title}
                                </div>
                                <div className="text-sm text-white/80 mb-3 line-clamp-1">
                                    {primaryOffer.description}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold">
                                    <span className="bg-white/20 px-2 py-1 rounded">{primaryOffer.terms}</span>
                                    <span className="text-emerald-200" suppressHydrationWarning>Ahorro: {formatCLP(primaryOffer.savings || 0)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botón de Acción Principal */}
                    {primaryOffer && (
                        <button
                            onClick={handleAction}
                            className="w-full bg-white text-emerald-900 hover:bg-emerald-50 py-4 rounded-xl font-black text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group/btn transform hover:-translate-y-1"
                        >
                            <span>{primaryOffer.ctaAction === 'ACTION_APPLY_GREEN' ? "Activar Beneficio Verde" : "Ver Opciones"}</span>
                            {primaryOffer.type === 'GREEN_CREDIT' && <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />}
                            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
