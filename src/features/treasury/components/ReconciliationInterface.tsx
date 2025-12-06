import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Link2, X } from "lucide-react";
import { useTreasuryStore } from "../stores/treasury.store";
import { formatCLP, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

// Mock ledger entries for demo
const mockLedgerEntries = [
    { id: 'l1', date: '2024-03-01', description: 'Pago Factura #123', amount: 1500000 },
    { id: 'l2', date: '2024-03-02', description: 'Pago Proveedor XYZ', amount: -500000 },
];

export function ReconciliationInterface() {
    const { bankLines, matchLine, unmatchLine } = useTreasuryStore();
    const pendingLines = bankLines.filter(l => l.status === 'PENDING');

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Bank Side */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Movimientos Bancarios (Pendientes)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingLines.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            No hay movimientos pendientes
                        </div>
                    ) : (
                        pendingLines.map(line => (
                            <div key={line.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                <div>
                                    <div className="font-medium">{line.description}</div>
                                    <div className="text-xs text-muted-foreground">{formatDate(line.date)}</div>
                                </div>
                                <div className="text-right">
                                    <div className={cn(
                                        "font-bold",
                                        line.amount > 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                        {formatCLP(line.amount)}
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                        <Link2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Ledger Side */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Contabilidad (Sugerencias)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mockLedgerEntries.map(entry => (
                        <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg border-dashed">
                            <div>
                                <div className="font-medium">{entry.description}</div>
                                <div className="text-xs text-muted-foreground">{formatDate(entry.date)}</div>
                            </div>
                            <div className="text-right">
                                <div className={cn(
                                    "font-bold",
                                    entry.amount > 0 ? "text-green-600" : "text-red-600"
                                )}>
                                    {formatCLP(entry.amount)}
                                </div>
                                <Button size="sm" variant="outline" className="h-6 px-2 text-xs ml-2">
                                    Conciliar
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
