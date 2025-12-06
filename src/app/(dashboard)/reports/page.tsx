"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { GenericReportPDF } from "@/features/reports/components/ReportTemplates";
import { FileDown, FileSpreadsheet } from "lucide-react";

export default function ReportsPage() {
    const [reportType, setReportType] = useState("sales");

    // Mock data for reports
    const mockData = [
        { date: '2024-03-01', description: 'Venta Factura #101', amount: 150000 },
        { date: '2024-03-02', description: 'Venta Factura #102', amount: 250000 },
        { date: '2024-03-03', description: 'Venta Factura #103', amount: 80000 },
    ];

    const getReportTitle = () => {
        switch (reportType) {
            case 'sales': return 'Libro de Ventas';
            case 'purchases': return 'Libro de Compras';
            case 'balance': return 'Balance General';
            default: return 'Reporte';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Reportes y Exportaciones</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Generar Reporte</CardTitle>
                        <CardDescription>Selecciona el tipo de reporte y el formato de descarga.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tipo de Reporte</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sales">Libro de Ventas</SelectItem>
                                    <SelectItem value="purchases">Libro de Compras</SelectItem>
                                    <SelectItem value="balance">Balance General</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <PDFDownloadLink
                                document={<GenericReportPDF title={getReportTitle()} data={mockData} />}
                                fileName={`${reportType}_report.pdf`}
                                className="w-full"
                            >
                                {({ loading }) => (
                                    <Button className="w-full" disabled={loading}>
                                        <FileDown className="mr-2 h-4 w-4" />
                                        {loading ? 'Generando...' : 'Descargar PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>

                            <Button variant="outline" className="w-full">
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Exportar CSV
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
