"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BankingPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Tesorería y Bancos</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Conciliación Bancaria</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Cargue su cartola bancaria para comenzar la conciliación automática.</p>
                </CardContent>
            </Card>
        </div>
    );
}
