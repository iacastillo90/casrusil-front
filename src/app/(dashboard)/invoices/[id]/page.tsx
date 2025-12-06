"use client";

import { useInvoice } from "@/features/invoicing/hooks/useInvoices";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCLP, formatDate, formatRut } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/features/invoicing/components/InvoicePDF";
import { DTEStatusTracker } from "@/features/invoicing/components/DTEStatusTracker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function InvoiceDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: invoice, isLoading } = useInvoice(id);

    if (isLoading) {
        return <div>Cargando factura...</div>;
    }

    if (!invoice) {
        return <div>Factura no encontrada</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Factura #{invoice.folio}</h1>
                <div className="flex gap-2">
                    <PDFDownloadLink
                        document={<InvoicePDF invoice={invoice} />}
                        fileName={`factura-${invoice.folio}.pdf`}
                    >
                        {({ loading }: { loading: boolean }) => (
                            <Button variant="outline" disabled={loading}>
                                <Download className="mr-2 h-4 w-4" />
                                {loading ? 'Generando PDF...' : 'Descargar PDF'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            <DTEStatusTracker status={invoice.status} />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Emisor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-3 gap-2 text-sm">
                            <dt className="font-medium text-muted-foreground">RUT:</dt>
                            <dd className="col-span-2">{formatRut(invoice.issuerRut)}</dd>
                        </dl>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Receptor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-3 gap-2 text-sm">
                            <dt className="font-medium text-muted-foreground">Razón Social:</dt>
                            <dd className="col-span-2">{invoice.recipientName}</dd>
                            <dt className="font-medium text-muted-foreground">RUT:</dt>
                            <dd className="col-span-2">{formatRut(invoice.recipientRut)}</dd>
                        </dl>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalle</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-right">Cant.</TableHead>
                                <TableHead className="text-right">Precio Unit.</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.lines.map((line) => (
                                <TableRow key={line.id}>
                                    <TableCell>{line.description}</TableCell>
                                    <TableCell className="text-right">{line.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCLP(line.unitPrice)}</TableCell>
                                    <TableCell className="text-right">{formatCLP(line.lineTotal)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-6 flex flex-col items-end space-y-2">
                        <div className="flex justify-between w-48">
                            <span className="text-muted-foreground">Neto:</span>
                            <span className="font-medium">{formatCLP(invoice.netAmount)}</span>
                        </div>
                        <div className="flex justify-between w-48">
                            <span className="text-muted-foreground">IVA:</span>
                            <span className="font-medium">{formatCLP(invoice.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between w-48 border-t pt-2">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-lg">{formatCLP(invoice.totalAmount)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
