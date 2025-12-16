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
import { feeService } from '../services/fee.service';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { toast } from 'sonner';
import { UploadCloud, Loader2 } from 'lucide-react';

export function FeeImportModal() {
    const [file, setFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const queryClient = useQueryClient();
    const companyId = useAuthStore(state => state.companyId);

    const mutation = useMutation({
        mutationFn: feeService.importFees,
        onSuccess: () => {
            toast.success(`Boletas importadas exitosamente.`);
            queryClient.invalidateQueries({ queryKey: ['fees'] });
            setIsOpen(false);
            setFile(null);
        },
        onError: (error: any) => {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al importar boletas.';
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
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <UploadCloud className="h-4 w-4" />
                    Importar Boletas
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Importar Boletas de Honorarios</DialogTitle>
                    <DialogDescription>
                        Sube el archivo CSV de honorarios exportado del SII.
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
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Importar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
