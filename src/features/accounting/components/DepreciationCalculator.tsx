import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/formatters";
import Decimal from "decimal.js";

export function DepreciationCalculator() {
    const [value, setValue] = useState("");
    const [life, setLife] = useState("");
    const [residual, setResidual] = useState("");
    const [result, setResult] = useState<{ monthly: number; yearly: number } | null>(null);

    const calculate = () => {
        const v = new Decimal(value || 0);
        const l = new Decimal(life || 1);
        const r = new Decimal(residual || 0);

        if (l.isZero()) return;

        const depreciableAmount = v.minus(r);
        const monthly = depreciableAmount.dividedBy(l);
        const yearly = monthly.times(12);

        setResult({
            monthly: monthly.toNumber(),
            yearly: yearly.toNumber(),
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Depreciación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label>Valor del Activo</Label>
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Ej: 1000000"
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Vida Útil (Meses)</Label>
                    <Input
                        type="number"
                        value={life}
                        onChange={(e) => setLife(e.target.value)}
                        placeholder="Ej: 36"
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Valor Residual</Label>
                    <Input
                        type="number"
                        value={residual}
                        onChange={(e) => setResidual(e.target.value)}
                        placeholder="Ej: 0"
                    />
                </div>

                <Button onClick={calculate} className="w-full">Calcular</Button>

                {result && (
                    <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Depreciación Mensual:</span>
                            <span className="font-bold">{formatCLP(result.monthly)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Depreciación Anual:</span>
                            <span className="font-bold">{formatCLP(result.yearly)}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
