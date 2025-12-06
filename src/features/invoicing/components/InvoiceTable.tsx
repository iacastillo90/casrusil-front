import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice } from "../types/invoice.types";
import { formatCLP, formatDate } from "@/lib/formatters";
import { Eye, FileText, Send } from "lucide-react";

interface InvoiceTableProps {
    invoices: Invoice[];
    isLoading: boolean;
    onView: (id: string) => void;
    onSend: (id: string) => void;
}

export function InvoiceTable({ invoices, isLoading, onView, onSend }: InvoiceTableProps) {
    if (isLoading) {
        return <div className="p-4 text-center">Cargando facturas...</div>;
    }

    if (invoices.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No hay facturas registradas.</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Folio</TableHead>
                        <TableHead>Emisor</TableHead>
                        <TableHead>Receptor</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Monto Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.folio}</TableCell>
                            <TableCell>{invoice.issuerRut}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{invoice.recipientName}</span>
                                    <span className="text-xs text-muted-foreground">{invoice.recipientRut}</span>
                                </div>
                            </TableCell>
                            <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                            <TableCell className="text-right font-mono">
                                {formatCLP(invoice.totalAmount)}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={invoice.status} />
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => onView(invoice.id)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onSend(invoice.id)}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function StatusBadge({ status }: { status: Invoice['status'] }) {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        DRAFT: "secondary",
        SIGNED: "default",
        SENT: "default",
        ACCEPTED: "outline", // Greenish usually, but using outline for now or custom class
        REJECTED: "destructive",
    };

    const labels: Record<string, string> = {
        DRAFT: "Borrador",
        SIGNED: "Firmada",
        SENT: "Enviada SII",
        ACCEPTED: "Aceptada",
        REJECTED: "Rechazada",
    };

    return (
        <Badge variant={variants[status] || "outline"}>
            {labels[status] || status}
        </Badge>
    );
}
