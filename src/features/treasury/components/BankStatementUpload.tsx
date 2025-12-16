// Force recompile
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useTreasuryStore } from "../stores/treasury.store";
import { toast } from "sonner"; // Changed import

export function BankStatementUpload() {
    const { uploadStatement, isLoading } = useTreasuryStore();
    const [file, setFile] = useState<File | null>(null);
    // Removed useToast hook

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        try {
            await uploadStatement(file);
            toast.success("Carga Exitosa", {
                description: "La cartola se ha procesado correctamente.",
            });
            setFile(null);
            // Resetear input file manualmente si es necesario
        } catch (error) {
            toast.error("Error de Carga", {
                description: "No se pudo procesar el archivo. Verifique el formato.",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cargar Cartola Bancaria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-end gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="statement-file">Archivo Excel (.xlsx)</Label>
                        <Input
                            id="statement-file"
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            disabled={isLoading}
                        />
                    </div>
                    <Button onClick={handleUpload} disabled={!file || isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Procesando..." : "Subir Cartola"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
