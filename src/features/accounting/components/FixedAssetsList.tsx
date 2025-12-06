import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCLP, formatDate } from "@/lib/formatters";

interface Asset {
    id: string;
    name: string;
    purchaseDate: string;
    purchaseValue: number;
    currentValue: number;
    accumulatedDepreciation: number;
    usefulLife: number; // in months
}

const mockAssets: Asset[] = [
    {
        id: '1',
        name: 'MacBook Pro M3',
        purchaseDate: '2024-01-15',
        purchaseValue: 2500000,
        currentValue: 2291667,
        accumulatedDepreciation: 208333,
        usefulLife: 36
    },
    {
        id: '2',
        name: 'Escritorio Ergonómico',
        purchaseDate: '2024-02-01',
        purchaseValue: 450000,
        currentValue: 425000,
        accumulatedDepreciation: 25000,
        usefulLife: 60
    },
];

export function FixedAssetsList() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Activos Fijos</CardTitle>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Activo
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Fecha Compra</TableHead>
                            <TableHead className="text-right">Valor Compra</TableHead>
                            <TableHead className="text-right">Deprec. Acum.</TableHead>
                            <TableHead className="text-right">Valor Actual</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockAssets.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell className="font-medium">{asset.name}</TableCell>
                                <TableCell>{formatDate(asset.purchaseDate)}</TableCell>
                                <TableCell className="text-right">{formatCLP(asset.purchaseValue)}</TableCell>
                                <TableCell className="text-right text-red-500">-{formatCLP(asset.accumulatedDepreciation)}</TableCell>
                                <TableCell className="text-right font-bold">{formatCLP(asset.currentValue)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
