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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoice.service';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { toast } from 'sonner';
import { UploadCloud, Loader2 } from 'lucide-react';

interface CsvImportModalProps {
    defaultBookType?: 'PURCHASE' | 'SALE';
}

export function CsvImportModal({ defaultBookType = 'PURCHASE' }: CsvImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [bookType, setBookType] = useState<'PURCHASE' | 'SALE'>(defaultBookType);
    const [isOpen, setIsOpen] = useState(false);

    const queryClient = useQueryClient();
    const companyId = useAuthStore(state => state.companyId);

    const mutation = useMutation({
        mutationFn: invoiceService.importInvoices,
        onSuccess: (data) => {
            // Assuming data has successCount and errorCount based on the plan
            toast.success(`Procesado exitosamente.`);
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            setIsOpen(false);
            setFile(null);
        },
        onError: (error: any) => {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al importar las facturas.';
            toast.error(msg);
        },
    });

    const handleImport = () => {
        if (!file) {
            toast.error("Selecciona un archivo");
            return;
        }
        if (!companyId) {
            toast.error("No hay una empresa seleccionada");
            return;
        }

        mutation.mutate({
            file,
            companyId,
            bookType
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <UploadCloud className="h-4 w-4" />
                    Importar CSV SII
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Importar Registro del SII</DialogTitle>
                    <DialogDescription>
                        Sube el archivo CSV de Compras o Ventas exportado del SII.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label>Tipo de Registro</Label>
                        <Select
                            value={bookType}
                            onValueChange={(v) => setBookType(v as 'PURCHASE' | 'SALE')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PURCHASE">Registro de Compras</SelectItem>
                                <SelectItem value="SALE">Registro de Ventas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Importar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
