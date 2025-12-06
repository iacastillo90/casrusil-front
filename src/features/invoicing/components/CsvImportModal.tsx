import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoice.service';
import { toast } from 'sonner';
import { UploadCloud } from 'lucide-react';

export function CsvImportModal() {
    const [file, setFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    // Mutación para subir el archivo
    const mutation = useMutation({
        mutationFn: invoiceService.importInvoices,
        onSuccess: () => {
            toast.success('Facturas importadas correctamente');
            // Invalidar la caché para que la lista de facturas se actualice sola
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            setIsOpen(false);
            setFile(null);
        },
        onError: (error) => {
            console.error(error);
            toast.error('Error al importar las facturas. Revisa el formato.');
        },
    });

    const handleImport = () => {
        if (!file) return;
        mutation.mutate(file);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <UploadCloud className="h-4 w-4" />
                    Importar CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Importar Registro del SII</DialogTitle>
                    <DialogDescription>
                        Sube el archivo CSV exportado desde el sitio del SII para procesar tus facturas automáticamente.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="csv_file">Archivo CSV</Label>
                        <Input
                            id="csv_file"
                            type="file"
                            accept=".csv,.xls,.xlsx"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleImport} disabled={!file || mutation.isPending}>
                        {mutation.isPending ? 'Procesando...' : 'Importar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
