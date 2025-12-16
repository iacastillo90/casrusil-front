import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Building2, Save, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSettingsStore } from "../stores/settings.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyProfileSchema, CompanyProfile as ICompanyProfile } from "../types/settings.types";
import { toast } from "sonner";
import { LogoUpload } from "@/components/shared/LogoUpload";

export function CompanyProfile() {
    const { company, updateCompany, isLoading } = useSettingsStore();
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Fallback default values
    const defaultCompany = {
        name: "",
        rut: "",
        address: "",
        email: "",
        phone: "",
        website: "",
        isProfileComplete: false,
    };

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ICompanyProfile>({
        resolver: zodResolver(companyProfileSchema),
        defaultValues: company ?? defaultCompany,
    });

    useEffect(() => {
        if (company) {
            reset(company);
        }
    }, [company, reset]);

    const onSubmit = async (data: ICompanyProfile) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'logoUrl' && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            if (logoFile) {
                formData.append("logo", logoFile);
            }

            await updateCompany(formData);
            toast.success("Perfil de empresa actualizado correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar perfil");
        }
    };

    return (
        <div className="space-y-6">
            {!company?.isProfileComplete && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Perfil Incompleto</AlertTitle>
                    <AlertDescription>
                        Por favor completa la información de tu empresa para desbloquear todas las funcionalidades.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Perfil de Empresa
                    </CardTitle>
                    <CardDescription>
                        Información legal y de contacto de la empresa. Estos datos aparecerán en tus facturas y correos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-[200px_1fr] gap-8">
                            {/* Logo Column */}
                            <div>
                                <LogoUpload
                                    currentLogo={company?.logoUrl}
                                    onLogoChange={setLogoFile}
                                />
                            </div>

                            {/* Inputs Column */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Razón Social <span className="text-red-500">*</span></Label>
                                    <Input id="name" {...register("name")} placeholder="Ej. Mi Empresa SpA" />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rut">RUT <span className="text-red-500">*</span></Label>
                                    <Input id="rut" {...register("rut")} placeholder="76.123.456-K" />
                                    {errors.rut && <p className="text-xs text-red-500">{errors.rut.message}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Dirección Comercial <span className="text-red-500">*</span></Label>
                                    <Input id="address" {...register("address")} placeholder="Calle, Número, Comuna, Ciudad" />
                                    {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Contacto <span className="text-red-500">*</span></Label>
                                    <Input id="email" type="email" {...register("email")} placeholder="contacto@empresa.cl" />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono <span className="text-red-500">*</span></Label>
                                    <Input id="phone" {...register("phone")} placeholder="+56 9 1234 5678" />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Sitio Web</Label>
                                    <Input id="website" {...register("website")} placeholder="https://" />
                                    {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
