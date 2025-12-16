import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { accountingService } from "../services/accounting.service";
import { PlusCircle, Loader2 } from "lucide-react";

export function CreateAccountModal() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        type: "ASSET",
        description: "" // Optional
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleValueChange = (val: string) => {
        setFormData({ ...formData, type: val });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Basic validation
            if (!formData.code || !formData.name) {
                toast.error("El código y el nombre son obligatorios");
                setIsLoading(false);
                return;
            }

            await accountingService.createAccount({
                code: formData.code,
                name: formData.name,
                type: formData.type,
                description: formData.description
            });

            toast.success("Cuenta contable creada exitosamente");
            setOpen(false);
            setFormData({ code: "", name: "", type: "ASSET", description: "" });
            // Ideally trigger a refetch of accounts/balance here
        } catch (error) {
            console.error(error);
            toast.error("Error al crear la cuenta");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva Cuenta
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Cuenta Contable</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">
                            Código
                        </Label>
                        <Input
                            id="code"
                            name="code"
                            placeholder="Ej: 1.1.01"
                            value={formData.code}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nombre
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej: Caja"
                            value={formData.name}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Tipo
                        </Label>
                        <Select value={formData.type} onValueChange={handleValueChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ASSET">Activo</SelectItem>
                                <SelectItem value="LIABILITY">Pasivo</SelectItem>
                                <SelectItem value="EQUITY">Patrimonio</SelectItem>
                                <SelectItem value="INCOME">Ingresos</SelectItem>
                                <SelectItem value="EXPENSE">Gastos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Desc.
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Opcional"
                            value={formData.description}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Crear Cuenta
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
