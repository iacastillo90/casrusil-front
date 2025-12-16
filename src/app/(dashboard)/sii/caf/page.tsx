"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, FileText, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { siiService } from "@/features/sii/services/sii.service";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CAFPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [lastUploadResult, setLastUploadResult] = useState<{ start: number; end: number } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const response = await siiService.uploadCAF(file);
            toast.success("Archivo CAF subido correctamente");
            setLastUploadResult(response.folioRange);
            setFile(null);
        } catch (error) {
            console.error(error);
            toast.error("Error al subir archivo CAF");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Administración de Folios (CAF)</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileUp className="h-5 w-5" />
                            Cargar Nuevos Folios
                        </CardTitle>
                        <CardDescription>
                            Sube el archivo XML descargado desde el portal del SII.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="caf-file">Archivo XML</Label>
                            <Input id="caf-file" type="file" accept=".xml" onChange={handleFileChange} />
                        </div>

                        {file && (
                            <div className="bg-muted p-3 rounded-md flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="truncate flex-1">{file.name}</span>
                            </div>
                        )}

                        <Button onClick={handleUpload} disabled={!file || uploading}>
                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                            Cargar CAF
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado de Folios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lastUploadResult ? (
                                <Alert className="bg-green-50 border-green-200">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-800">Carga Exitosa</AlertTitle>
                                    <AlertDescription className="text-green-700">
                                        Se han cargado los folios desde el <strong>{lastUploadResult.start}</strong> al <strong>{lastUploadResult.end}</strong>.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Información</AlertTitle>
                                    <AlertDescription>
                                        No se ha realizado carga de folios recientemente en esta sesión.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
