import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { formatCLP } from "@/lib/formatters";
import { useEffect, useState } from "react";

const data = [
    { name: "Ene", total: 4500000 },
    { name: "Feb", total: 3200000 },
    { name: "Mar", total: 5100000 },
    { name: "Abr", total: 2800000 },
    { name: "May", total: 4900000 },
    { name: "Jun", total: 5800000 },
    { name: "Jul", total: 4200000 },
    { name: "Ago", total: 3900000 },
    { name: "Sep", total: 5500000 },
    { name: "Oct", total: 4800000 },
    { name: "Nov", total: 5200000 },
    { name: "Dic", total: 6100000 },
];

export function SalesChart() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Resumen de Ventas</CardTitle>
                </CardHeader>
                <CardContent className="pl-2 h-[350px] flex items-center justify-center">
                    <div className="h-full w-full bg-muted/10 animate-pulse rounded" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Resumen de Ventas</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCLP(value)}
                            cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
