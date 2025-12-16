import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { taxAuditService } from '../services/audit.service';
import { TaxAuditReport, AuditDiscrepancy } from '../types/audit.types';
import { AlertCircle, CheckCircle, FileText, ArrowRight, AlertTriangle } from 'lucide-react';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'MATCH':
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Coincide</Badge>;
        case 'MISSING_IN_ERP':
            return <Badge variant="destructive">Falta en ERP</Badge>;
        case 'MISSING_IN_SII':
            return <Badge variant="destructive">Falta en SII</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export function TaxAuditDashboard() {
    const [year, setYear] = useState<string>("2025");
    const [month, setMonth] = useState<string>("10");
    const [report, setReport] = useState<TaxAuditReport | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadReport();
    }, [year, month]);

    const loadReport = async () => {
        setLoading(true);
        try {
            const data = await taxAuditService.getReport(`${year}-${month}`);
            console.log("🔥 REPORTE RECIBIDO:", data);
            setReport(data);
        } catch (error) {
            console.error("Failed to load audit report", error);
        } finally {
            setLoading(false);
        }
    };

    const renderKPICard = (title: string, amount: number, subtitle: string, icon: React.ReactNode) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
        </Card>
    );

    const renderTable = (entries: AuditDiscrepancy[]) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Folio</TableHead>
                        <TableHead>Contraparte</TableHead>
                        <TableHead className="text-right">Monto SII</TableHead>
                        <TableHead className="text-right">Monto ERP</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>{formatDate(entry.date)}</TableCell>
                            <TableCell>{entry.folio}</TableCell>
                            <TableCell className="font-medium">{entry.counterpart}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.amountSii)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.amountErp)}</TableCell>
                            <TableCell className="text-center">
                                {getStatusBadge(entry.status)}
                            </TableCell>
                        </TableRow>
                    ))}
                    {entries.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No se encontraron documentos para este periodo.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    const salesEntries = report?.discrepancies.filter(d => d.type === 'VENTA') || [];
    const purchaseEntries = report?.discrepancies.filter(d => d.type === 'COMPRA') || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Auditoría Tributaria</h2>
                    <p className="text-muted-foreground">Conciliación automática SII vs ERP</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="09">Septiembre</SelectItem>
                            <SelectItem value="10">Octubre</SelectItem>
                            <SelectItem value="11">Noviembre</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={loadReport} disabled={loading}>
                        {loading ? "Cargando..." : "Actualizar"}
                    </Button>
                </div>
            </div>

            {report && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {renderKPICard("Ventas Netas", report.summary.sales.totalNet, `${report.summary.sales.totalDocs} documentos`, <FileText className="h-4 w-4 text-muted-foreground" />)}
                        {renderKPICard("Ventas IVA", report.summary.sales.totalTax, "Débito Fiscal", <ArrowRight className="h-4 w-4 text-red-500" />)}
                        {renderKPICard("Compras Netas", report.summary.purchases.totalNet, `${report.summary.purchases.totalDocs} documentos`, <FileText className="h-4 w-4 text-muted-foreground" />)}
                        {renderKPICard("Compras IVA", report.summary.purchases.totalTax, "Crédito Fiscal", <ArrowRight className="h-4 w-4 text-green-500" />)}
                    </div>

                    <Tabs defaultValue="sales" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="sales">Ventas ({report.summary.sales.totalDocs})</TabsTrigger>
                            <TabsTrigger value="purchases">Compras ({report.summary.purchases.totalDocs})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="sales" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Conciliación de Ventas</h3>
                                {report.summary.sales.missingInErp > 0 && (
                                    <Button variant="destructive" size="sm">
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Faltan {report.summary.sales.missingInErp} en ERP
                                    </Button>
                                )}
                            </div>
                            {renderTable(salesEntries)}
                        </TabsContent>
                        <TabsContent value="purchases" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Conciliación de Compras</h3>
                                {report.summary.purchases.missingInErp > 0 && (
                                    <Button variant="destructive" size="sm">
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Faltan {report.summary.purchases.missingInErp} en ERP
                                    </Button>
                                )}
                            </div>
                            {renderTable(purchaseEntries)}
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}
