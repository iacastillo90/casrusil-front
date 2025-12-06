import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "../stores/settings.store";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Building2, Save } from "lucide-react";

export function CompanyProfile() {
    const { company, updateCompany } = useSettingsStore();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: company
    });

    useEffect(() => {
        reset(company);
    }, [company, reset]);

    const onSubmit = (data: any) => {
        updateCompany(data);
        // Show toast success
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Perfil de Empresa
                </CardTitle>
                <CardDescription>
                    Información legal y de contacto de la empresa.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Razón Social</Label>
                            <Input id="name" {...register("name")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rut">RUT</Label>
                            <Input id="rut" {...register("rut")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección Comercial</Label>
                            <Input id="address" {...register("address")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Sitio Web</Label>
                            <Input id="website" {...register("website")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Contacto</Label>
                            <Input id="email" type="email" {...register("email")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" {...register("phone")} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
