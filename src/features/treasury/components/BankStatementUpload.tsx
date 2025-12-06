import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet } from "lucide-react";
import { useTreasuryStore } from "../stores/treasury.store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCLP } from "@/lib/formatters";

export function BankStatementUpload() {
    const { addBankLines } = useTreasuryStore();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Mock parsing for preview
            setPreview([
                { date: '2024-03-01', description: 'Transferencia Recibida Cliente A', amount: 1500000 },
                { date: '2024-03-02', description: 'Pago Proveedores', amount: -500000 },
                { date: '2024-03-03', description: 'Comisión Bancaria', amount: -15000 },
            ]);
        }
    };

    const handleUpload = () => {
        if (!preview.length) return;
        addBankLines(preview);
        setFile(null);
        setPreview([]);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cargar Cartola Bancaria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-end gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="csv">Archivo CSV / Excel</Label>
                        <Input
                            id="csv"
                            type="file"
                            accept=".csv,.xlsx"
                            onChange={handleFileChange}
                        />
                    </div>
                    <Button onClick={handleUpload} disabled={!file}>
                        <Upload className="mr-2 h-4 w-4" />
                        Procesar
                    </Button>
                </div>

                {preview.length > 0 && (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {preview.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell className="text-right">{formatCLP(row.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
