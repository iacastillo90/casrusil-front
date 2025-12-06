import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface Rule {
    id: string;
    name: string;
    description: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    status: 'ACTIVE' | 'INACTIVE';
}

const rules: Rule[] = [
    { id: '1', name: 'Saldo de Caja Negativo', description: 'La cuenta de Caja no puede tener saldo acreedor.', severity: 'CRITICAL', status: 'ACTIVE' },
    { id: '2', name: 'Partida Doble', description: 'La suma de débitos debe ser igual a la suma de créditos en cada asiento.', severity: 'CRITICAL', status: 'ACTIVE' },
    { id: '3', name: 'Cuenta Sin Movimiento', description: 'Cuentas activas sin movimientos en los últimos 6 meses.', severity: 'WARNING', status: 'ACTIVE' },
    { id: '4', name: 'Saldo Banco vs Cartola', description: 'Diferencia entre saldo contable y saldo bancario.', severity: 'CRITICAL', status: 'INACTIVE' },
];

export function AccountValidationRules() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reglas de Validación Contable</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {rules.map((rule) => (
                        <div key={rule.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{rule.name}</span>
                                    <Badge variant={
                                        rule.severity === 'CRITICAL' ? 'destructive' :
                                            rule.severity === 'WARNING' ? 'secondary' : 'outline'
                                    }>
                                        {rule.severity}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{rule.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {rule.status === 'ACTIVE' ? (
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Activa
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        <XCircle className="w-3 h-3 mr-1" /> Inactiva
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
