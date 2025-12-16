"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { authService } from "../services/auth.service";
import Link from "next/link";
import { LoginCredentials } from "../types/auth.types";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true);
        try {
            // 1. Llamada al Backend Real (el servicio ya actualiza el store via handleAuthSuccess)
            const response = await authService.login({
                email: data.email,
                password: data.password,
            });

            // 2. Notificación
            toast.success("¡Bienvenido!", {
                description: `Has iniciado sesión como ${response.userName}`,
            });

            // 3. Redirección
            router.push('/dashboard');
            router.refresh();

        } catch (error: any) {
            // Manejo de errores 
            const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';

            toast.error("Error de autenticación", {
                description: errorMessage,
            });

            // Resetear password si falla
            form.setValue('password', '');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                <CardDescription>
                    Ingresa tu email para acceder a tu cuenta
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="nombre@empresa.com"
                                            type="email"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Ingresando..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="text-sm text-center text-muted-foreground">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="underline text-primary">
                        Regístrate
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
