/**
 * Carbon Footprint Chart Component
 * refined display with premium styling
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { useSustainabilityStore } from "../stores/sustainability.store";
import { Leaf, Info } from "lucide-react";
import { formatCLP } from "@/lib/formatters"; // Assuming useful for number format if needed or custom

export function CarbonFootprintChart() {
    const [mounted, setMounted] = useState(false);
    const { monthlyEmissions = [], isLoading, fetchSustainabilityData } = useSustainabilityStore();

    useEffect(() => {
        setMounted(true);
        // Force fetch to ensure demo data
        if (monthlyEmissions.length === 0) {
            fetchSustainabilityData();
        }
    }, [monthlyEmissions.length, fetchSustainabilityData]);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-900 border border-green-100 dark:border-green-900 p-3 rounded-lg shadow-lg">
                    <p className="font-medium text-sm mb-1">{label}</p>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Leaf className="h-3 w-3" />
                        <span className="font-bold">{payload[0].value} kgCO2</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Emisiones netas
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!mounted) {
        return (
            <Card className="col-span-1 shadow-sm border-green-100/50 dark:border-green-900/20">
                <CardHeader>
                    <CardTitle>Cargando...</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 shadow-md border-green-100 dark:border-green-900/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Huella de Carbono</CardTitle>
                            <CardDescription className="text-xs">
                                Monitor de emisiones mensuales
                            </CardDescription>
                        </div>
                    </div>
                    {/* Optional Info Icon */}
                    <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        <Info className="h-4 w-4" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-0">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyEmissions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                        <XAxis
                            dataKey="month"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="co2"
                            stroke="#22c55e"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCO2)"
                            activeDot={{ r: 6, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="mt-4 px-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-muted-foreground">Emisiones Reales</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 dashed border border-slate-400"></div>
                        <span className="text-muted-foreground">Proyección IA</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
