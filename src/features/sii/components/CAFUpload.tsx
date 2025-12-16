import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileCode } from "lucide-react";
import { useSIIStore } from "../stores/sii.store";
import { formatDate } from "@/lib/formatters";
import { siiService } from "../services/sii.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CAFUpload() {
    const { cafs, addCAF } = useSIIStore();
    const [file, setFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        try {
            const response = await siiService.uploadCAF(file);

            // Assuming backend returns range info, we add it to the store
            // We use the response data to populate store properly
            // If backend doesn't return full object, we might need a fetchCAFs method later
            // For now, we update local store with optimistic success or response data

            addCAF({
                filename: file.name,
                type: 33, // Ideally this comes from backend parsing response
                rangeStart: response.folioRange?.start || 0,
                rangeEnd: response.folioRange?.end || 0,
            });

            setFile(null);
            toast.success(response.message || "Archivo CAF cargado exitosamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar el archivo CAF");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Administración de Folios (CAF)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-end gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="caf">Cargar archivo CAF (.xml)</Label>
                        <Input
                            id="caf"
                            type="file"
                            accept=".xml"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </div>
                    <Button onClick={handleUpload} disabled={!file || isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isLoading ? "Procesando..." : "Cargar Folios"}
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo DTE</TableHead>
                                <TableHead>Archivo</TableHead>
                                <TableHead>Rango</TableHead>
                                <TableHead>Folio Actual</TableHead>
                                <TableHead>Fecha Carga</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cafs.map((caf) => (
                                <TableRow key={caf.id}>
                                    <TableCell className="font-medium">
                                        {caf.type === 33 ? 'Factura Electrónica (33)' :
                                            caf.type === 34 ? 'Factura Exenta (34)' :
                                                caf.type === 61 ? 'Nota de Crédito (61)' : caf.type}
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <FileCode className="h-4 w-4 text-muted-foreground" />
                                        {caf.filename}
                                    </TableCell>
                                    <TableCell>{caf.rangeStart} - {caf.rangeEnd}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{caf.currentFolio}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({Math.round(((caf.currentFolio - caf.rangeStart) / (caf.rangeEnd - caf.rangeStart)) * 100)}% usado)
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(caf.uploadDate)}</TableCell>
                                    <TableCell>
                                        <Badge variant={caf.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {caf.status === 'ACTIVE' ? 'Activo' : 'Agotado'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
