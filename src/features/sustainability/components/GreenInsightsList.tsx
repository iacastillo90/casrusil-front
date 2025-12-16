/**
 * Green Insights List Component
 * Enhanced visuals for AI recommendations
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { useEffect } from "react";
import { useSustainabilityStore } from "../stores/sustainability.store";
import { EcoTipSeverity } from "../types/sustainability.types";
import { Button } from "@/components/ui/button";

export function GreenInsightsList() {
    const { ecoTips = [], fetchSustainabilityData } = useSustainabilityStore();

    useEffect(() => {
        // Force fetch to ensure demo data
        if (ecoTips.length === 0) {
            fetchSustainabilityData();
        }
    }, [ecoTips.length, fetchSustainabilityData]);

    // Fallback if empty array - DEMO HACK
    const displayTips = ecoTips.length > 0 ? ecoTips : [
        {
            id: '1',
            message: 'Detectamos 5 facturas de papel. Cámbiate a digital y ahorra 0.5kg CO2',
            severity: 'warning' as EcoTipSeverity,
            icon: '⚠️',
        },
        {
            id: '2',
            message: 'Optimiza tus rutas de entrega para reducir emisiones',
            severity: 'info' as EcoTipSeverity,
            icon: '💡',
        }
    ];

    const getAlertStyle = (severity: EcoTipSeverity) => {
        switch (severity) {
            case 'success':
                return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800';
            case 'warning':
                return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/40 dark:to-orange-950/40 dark:border-amber-800';
            case 'info':
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/40 dark:to-indigo-950/40 dark:border-blue-800';
            default:
                return 'bg-gray-50';
        }
    };

    const getIconColor = (severity: EcoTipSeverity) => {
        switch (severity) {
            case 'success': return 'text-green-600 dark:text-green-400';
            case 'warning': return 'text-amber-600 dark:text-amber-400';
            case 'info': return 'text-blue-600 dark:text-blue-400';
        }
    };

    return (
        <Card className="shadow-md border-green-100 dark:border-green-900/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Insights Ecológicos</CardTitle>
                            <CardDescription className="text-xs">
                                Recomendaciones activas de tu Asistente IA
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {displayTips.map((tip) => (
                    <div
                        key={tip.id}
                        className={`p-4 rounded-xl border ${getAlertStyle(tip.severity)} transition-all hover:scale-[1.02] cursor-default`}
                    >
                        <div className="flex gap-4">
                            <div className={`mt-0.5 text-lg ${getIconColor(tip.severity)}`}>
                                {tip.id === '1' ? '⚠️' : tip.id === '2' ? '🚚' : tip.id === '3' ? '👏' : '💡'}
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-sm font-medium text-foreground leading-relaxed">
                                    {tip.message}
                                </p>
                                <div className="flex items-center gap-2">
                                    {tip.severity === 'warning' && (
                                        <Button variant="outline" size="sm" className="h-7 text-xs bg-white/50 border-amber-200 text-amber-700 hover:bg-white hover:text-amber-800">
                                            Solucionar
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    )}
                                    {tip.severity === 'info' && (
                                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 p-0 hover:bg-transparent">
                                            Ver detalle
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-green-600 mt-2">
                    <Lightbulb className="mr-2 h-3 w-3" />
                    Generar nuevo análisis con IA...
                </Button>
            </CardContent>
        </Card>
    );
}
