import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCLP } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface IncomeStatementItem {
    id: string;
    name: string;
    amount: number;
    level: number;
    type: 'REVENUE' | 'EXPENSE' | 'TOTAL';
}

const mockData: IncomeStatementItem[] = [
    { id: '1', name: 'Ingresos por Ventas', amount: 15000000, level: 0, type: 'REVENUE' },
    { id: '2', name: 'Ventas de Servicios', amount: 12000000, level: 1, type: 'REVENUE' },
    { id: '3', name: 'Ventas de Productos', amount: 3000000, level: 1, type: 'REVENUE' },
    { id: '4', name: 'Costo de Ventas', amount: -4500000, level: 0, type: 'EXPENSE' },
    { id: '5', name: 'Margen Bruto', amount: 10500000, level: 0, type: 'TOTAL' },
    { id: '6', name: 'Gastos de Administración', amount: -2500000, level: 0, type: 'EXPENSE' },
    { id: '7', name: 'Remuneraciones', amount: -1500000, level: 1, type: 'EXPENSE' },
    { id: '8', name: 'Arriendos', amount: -500000, level: 1, type: 'EXPENSE' },
    { id: '9', name: 'Servicios Básicos', amount: -500000, level: 1, type: 'EXPENSE' },
    { id: '10', name: 'Utilidad Operacional', amount: 8000000, level: 0, type: 'TOTAL' },
    { id: '11', name: 'Impuestos', amount: -2160000, level: 0, type: 'EXPENSE' },
    { id: '12', name: 'Utilidad Neta', amount: 5840000, level: 0, type: 'TOTAL' },
];

export function IncomeStatement() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado de Resultados</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cuenta</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockData.map((item) => (
                            <TableRow key={item.id} className={cn(
                                item.type === 'TOTAL' && "font-bold bg-muted/50",
                                item.level === 0 && item.type !== 'TOTAL' && "font-semibold"
                            )}>
                                <TableCell style={{ paddingLeft: `${item.level * 20 + 10}px` }}>
                                    {item.name}
                                </TableCell>
                                <TableCell className={cn(
                                    "text-right",
                                    item.amount < 0 && "text-red-500"
                                )}>
                                    {formatCLP(item.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
