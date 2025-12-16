import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, Loader2, Mail, Shield, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useSettingsStore } from "../stores/settings.store";
import { toast } from "sonner";
import { InviteUserModal } from "./InviteUserModal";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export function UserManagement() {
    const { users, isLoading, fetchSettings, removeUser } = useSettingsStore();
    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleRemoveUser = async (userId: string) => {
        if (confirm("¿Estás seguro de eliminar a este usuario?")) {
            try {
                await removeUser(userId);
                toast.success("Usuario eliminado");
            } catch (error) {
                toast.error("No se pudo eliminar al usuario");
            }
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 gap-1"><ShieldCheck className="w-3 h-3" /> Admin</Badge>;
            case 'ACCOUNTANT':
                return <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 gap-1"><Shield className="w-3 h-3" /> Contador</Badge>;
            default:
                return <Badge variant="outline" className="text-muted-foreground">Visualizador</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge className="bg-emerald-500 hover:bg-emerald-600">Activo</Badge>;
            case 'INVITED':
            case 'PENDING':
                return <Badge variant="secondary" className="gap-1"><Mail className="w-3 h-3" /> Invitado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Gestión de Usuarios
                    </CardTitle>
                    <CardDescription>
                        Administra el acceso y roles de los usuarios de tu empresa.
                    </CardDescription>
                </div>
                <InviteUserModal />
            </CardHeader>
            <CardContent>
                {isLoading && users.length === 0 ? (
                    <div className="flex justify-center p-8 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No hay usuarios registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => {
                                    const isMe = user.email === currentUser?.email;
                                    return (
                                        <TableRow key={user.id} className={isMe ? "bg-muted/30" : ""}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{user.name || "Sin nombre"}</span>
                                                    {isMe && <span className="text-[10px] text-blue-600 font-bold uppercase">(Tú)</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                                            <TableCell className="text-right">
                                                {!isMe && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveUser(user.id)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
