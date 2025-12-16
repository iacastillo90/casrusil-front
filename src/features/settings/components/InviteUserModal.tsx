import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteUserSchema, UserInvitation } from "../types/settings.types";
import { useSettingsStore } from "../stores/settings.store";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, UserPlus } from "lucide-react";

interface InviteUserModalProps {
    children?: React.ReactNode;
}

export function InviteUserModal({ children }: InviteUserModalProps) {
    const [open, setOpen] = useState(false);
    const { inviteUser, company } = useSettingsStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserInvitation>({
        resolver: zodResolver(inviteUserSchema),
        defaultValues: {
            role: 'VIEWER'
        }
    });

    const onSubmit = async (data: UserInvitation) => {
        setIsSubmitting(true);
        try {
            await inviteUser(data.email, data.role, data.name);
            toast.success(`Invitación enviada a ${data.email}`);
            setOpen(false);
            reset();
        } catch (error) {
            console.error(error);
            toast.error("Error al enviar invitación");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" /> Invitar Usuario
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Invitar miembro del equipo</DialogTitle>
                    <DialogDescription>
                        Envía una invitación por correo para que se unan a <span className="font-semibold text-foreground">{company.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre (Opcional)</Label>
                        <Input id="name" {...register("name")} placeholder="Nombre del colaborador" />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" className="pl-9" {...register("email")} placeholder="colaborador@ejemplo.com" />
                        </div>
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select onValueChange={(val) => setValue('role', val as any)} defaultValue="VIEWER">
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">
                                    <div className="flex flex-col items-start py-1">
                                        <span className="font-medium">Administrador</span>
                                        <span className="text-xs text-muted-foreground">Acceso total a la configuración y usuarios.</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="ACCOUNTANT">
                                    <div className="flex flex-col items-start py-1">
                                        <span className="font-medium">Contador</span>
                                        <span className="text-xs text-muted-foreground">Puede gestionar libros contables e impuestos.</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="VIEWER">
                                    <div className="flex flex-col items-start py-1">
                                        <span className="font-medium">Visualizador</span>
                                        <span className="text-xs text-muted-foreground">Solo lectura de reportes y dashboard.</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground flex gap-2">
                        <div className="shrink-0 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-1 rounded-full w-5 h-5 flex items-center justify-center font-bold">i</div>
                        <p>
                            El usuario recibirá un correo desde <strong>invitaciones@sii-erp-ai.com</strong> a nombre de <strong>{company.name}</strong> ({company.rut}).
                        </p>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar Invitación
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
