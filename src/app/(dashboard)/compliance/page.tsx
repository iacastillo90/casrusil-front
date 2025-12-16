"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { feeService } from '@/features/fees/services/fee.service';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CompliancePage() {
    const [year, setYear] = useState<string>("2024");
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const blob = await feeService.downloadDj1879(parseInt(year));

            // Create download link
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `DJ1879_${year}.txt`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            toast.success("Archivo descargado exitosamente");
        } catch (error) {
            console.error("Error downloading compliance file:", error);
            toast.error("Error al descargar el archivo de declaración.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Cumplimiento Tributario</h2>
                <p className="text-muted-foreground">
                    Generación de declaraciones juradas y reportes anuales.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            DJ 1879 (Honorarios)
                        </CardTitle>
                        <CardDescription>
                            Declaración Jurada Anual sobre Retenciones de 2da Categoría.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Año Tributario</label>
                            <Select value={year} onValueChange={setYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione año" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024 (AT 2025)</SelectItem>
                                    <SelectItem value="2025">2025 (AT 2026)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Total Retenido:</span>
                                <span className="font-mono font-bold">$0</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                * Se calculará al generar el archivo.
                            </p>
                        </div>

                        <Button
                            className="w-full gap-2"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Generar Archivo PREVIRED/SII
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
