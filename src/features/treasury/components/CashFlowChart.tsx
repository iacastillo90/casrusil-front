"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Bar, ComposedChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCLP } from "@/lib/formatters";
import { useTreasuryStore } from "../stores/treasury.store";

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const YEARS = [2024, 2025, 2026];

export function CashFlowChart() {
    const { fetchDailyCashFlow, dailyCashFlowData, isLoading, selectedDate, setCashFlowDate } = useTreasuryStore();

    useEffect(() => {
        fetchDailyCashFlow();
    }, []);

    const chartData = dailyCashFlowData?.days.map(d => ({
        day: d.date.split('-')[2], // Solo el día (DD)
        fullDate: d.date,
        Ingresos: d.income,
        Egresos: d.expense,
        Balance: d.balance
    })) || [];

    return (
        <Card className="col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Flujo de Caja Diario</CardTitle>

                    {/* 🎛️ Controles Dinámicos */}
                    <div className="flex gap-2">
                        <Select
                            value={selectedDate.month.toString()}
                            onValueChange={(v) => setCashFlowDate(selectedDate.year, parseInt(v))}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Mes" />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTHS.map((m, i) => (
                                    <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedDate.year.toString()}
                            onValueChange={(v) => setCashFlowDate(parseInt(v), selectedDate.month)}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Año" />
                            </SelectTrigger>
                            <SelectContent>
                                {YEARS.map((y) => (
                                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            Cargando datos...
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No hay movimientos para este periodo.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    label={{ value: 'Día del Mes', position: 'insideBottom', offset: -5 }}
                                />
                                <YAxis
                                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    labelFormatter={(label) => `${label} de ${MONTHS[selectedDate.month - 1]}`}
                                    formatter={(value: number) => [formatCLP(value), ""]}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />

                                {/* Barras para Ingresos y Egresos Diarios */}
                                <Bar dataKey="Ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={8} />
                                <Bar dataKey="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={8} />

                                {/* Área para Balance Acumulado */}
                                <Area
                                    type="monotone"
                                    dataKey="Balance"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fill="url(#colorBalance)"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
