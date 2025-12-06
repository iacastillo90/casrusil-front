import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "../stores/auth.store";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Cookies from "js-cookie";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { setAuth } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);

            const { token, user, companyId, companies } = response;

            // Cookie expiration 7 days
            Cookies.set("auth-token", token, { expires: 7 });

            setAuth(token, user, companyId);
            // Assuming setCompanies exists in store, if not we might need to add it or update setAuth
            // Based on store definition: setCompanies: (companies: Company[]) => void;
            const { setCompanies } = useAuthStore.getState();
            setCompanies(companies);

            toast.success("Bienvenido de vuelta");
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.message || "Credenciales inválidas");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                <CardDescription>
                    Ingresa tu email para acceder a tu cuenta
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                        {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? "Ingresando..." : "Ingresar"}
                    </Button>
                    <div className="text-sm text-center text-muted-foreground">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="underline text-primary">
                            Regístrate
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
