import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCLP } from "@/lib/formatters";
import { Fee } from "../services/fee.service";
import { Badge } from "@/components/ui/badge";

interface FeeTableProps {
    fees: Fee[];
    isLoading?: boolean;
}

export function FeeTable({ fees, isLoading }: FeeTableProps) {
    if (isLoading) {
        return <div className="p-4 text-center">Cargando boletas...</div>;
    }

    if (fees.length === 0) {
        return (
            <div className="p-8 text-center border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No hay boletas de honorarios registradas.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Folio</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Prestador</TableHead>
                        <TableHead className="text-right">Bruto</TableHead>
                        <TableHead className="text-right">Retención</TableHead>
                        <TableHead className="text-right">Líquido</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fees.map((fee) => (
                        <TableRow key={fee.id}>
                            <TableCell className="font-medium">{fee.folio}</TableCell>
                            <TableCell>{fee.date}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{fee.providerName}</span>
                                    <span className="text-xs text-muted-foreground">{fee.providerRut}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">{formatCLP(fee.grossAmount)}</TableCell>
                            <TableCell className="text-right text-red-600">
                                {formatCLP(fee.retentionAmount)}
                            </TableCell>
                            <TableCell className="text-right font-bold text-green-600">
                                {formatCLP(fee.netAmount)}
                            </TableCell>
                            <TableCell>
                                <Badge variant={fee.status === 'VALID' ? 'success' : 'destructive'}>
                                    {fee.status === 'VALID' ? 'Vigente' : 'Anulada'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
