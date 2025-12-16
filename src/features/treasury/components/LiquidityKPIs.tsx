"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCLP } from "@/lib/formatters";
import { useTreasuryStore } from "../stores/treasury.store";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LiquidityRatio } from "../services/treasury.service";

export function LiquidityKPIs() {
    const { fetchLiquidityKPIs, liquidityData, isLoading, selectedDate } = useTreasuryStore();

    useEffect(() => {
        fetchLiquidityKPIs();
    }, []);

    // Helper para renderizar variación
    const renderTrend = (ratio?: LiquidityRatio) => {
        if (!ratio) return <Skeleton className="h-4 w-20" />;

        const isPositive = ratio.trend > 0;
        const isNeutral = ratio.trend === 0;

        return (
            <p className={cn(
                "text-xs flex items-center gap-1",
                isPositive ? "text-green-600" : isNeutral ? "text-muted-foreground" : "text-red-500"
            )}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : isNeutral ? <Minus className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isNeutral ? "Sin cambios" : `${ratio.trend > 0 ? '+' : ''}${ratio.trend} vs mes anterior`}
            </p>
        );
    };

    const getValueColor = (val: number, type: 'ratio' | 'cash') => {
        if (type === 'ratio') {
            if (val >= 1.5) return "text-green-600";
            if (val >= 1.0) return "text-yellow-600";
            return "text-red-600";
        }
        return "text-foreground";
    };

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Razón Corriente */}
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <DollarSign className="h-24 w-24 text-blue-500" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium">Razón Corriente</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="relative z-10">
                    {isLoading || !liquidityData ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ) : (
                        <>
                            <div className={cn("text-2xl font-bold", getValueColor(liquidityData.currentRatio.value, 'ratio'))}>
                                {liquidityData.currentRatio?.value?.toFixed(2) ?? '0.00'}
                            </div>
                            {renderTrend(liquidityData.currentRatio)}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Prueba Ácida */}
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Wallet className="h-24 w-24 text-purple-500" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium">Prueba Ácida</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="relative z-10">
                    {isLoading || !liquidityData ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ) : (
                        <>
                            <div className={cn("text-2xl font-bold", getValueColor(liquidityData.acidTest.value, 'ratio'))}>
                                {liquidityData.acidTest?.value?.toFixed(2) ?? '0.00'}
                            </div>
                            {renderTrend(liquidityData.acidTest)}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Capital de Trabajo */}
            <Card className="relative overflow-hidden border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Capital de Trabajo</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    {isLoading || !liquidityData ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    ) : (
                        <>
                            <div className="text-2xl font-bold text-foreground">
                                {formatCLP(liquidityData.workingCapital?.value ?? 0)}
                            </div>
                            <div className="flex justify-between items-end mt-1">
                                {renderTrend(liquidityData.workingCapital)}
                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                                    {liquidityData.daysCashOnHand ?? 0} días caja
                                </span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
