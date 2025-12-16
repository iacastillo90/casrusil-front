"use client";

import React, { useEffect, useState } from "react";
import { indicatorsService, EconomicIndicators } from "@/features/integration/services/indicators.service";
import { TrendingUp, DollarSign, Coins, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function EconomicIndicatorsWidget() {
    const [indicators, setIndicators] = useState<EconomicIndicators | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchIndicators = async () => {
            try {
                const data = await indicatorsService.getTodayIndicators();
                setIndicators(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchIndicators();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);
    }

    if (error) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Badge variant="outline" className="text-muted-foreground border-dashed">
                            <AlertCircle className="w-3 h-3 mr-1" /> Indicadores
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>No se pudo conectar con Mindicador.cl</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-muted/50 p-1 px-3 rounded-full border border-border/50 text-xs font-medium backdrop-blur-sm hover:bg-muted/80 transition-colors cursor-help">
                        {/* UF */}
                        <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>UF: {indicators?.uf && formatCurrency(indicators.uf)}</span>
                        </div>
                        <div className="w-[1px] h-3 bg-border" />

                        {/* USD */}
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <DollarSign className="w-3 h-3" />
                            <span>USD: {indicators?.usd && formatCurrency(indicators.usd)}</span>
                        </div>
                        <div className="w-[1px] h-3 bg-border" />

                        {/* UTM */}
                        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <Coins className="w-3 h-3" />
                            <span>UTM: {indicators?.utm && formatCurrency(indicators.utm)}</span>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Fuente: {indicators?.source} - Actualizado Hoy</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
