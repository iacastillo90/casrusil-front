import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "../stores/settings.store";
import { Bell, Loader2, Send } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useState } from "react";
import { toast } from "sonner";

export function PersonalSettings() {
    const { notifications, updateNotifications, triggerReport } = useSettingsStore();
    const { isConnected } = usePushNotifications(); // Just to initialize connection
    const [isSendingReport, setIsSendingReport] = useState(false);

    const handleTriggerReport = async () => {
        setIsSendingReport(true);
        try {
            await triggerReport();
            toast.success("Tu resumen semanal ha sido enviado a tu correo.");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el reporte.");
        } finally {
            setIsSendingReport(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Preferencias y Notificaciones
                </CardTitle>
                <CardDescription>
                    Configura cómo quieres recibir las alertas.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="email-notif">Notificaciones por Email</Label>
                        <span className="font-normal text-xs text-muted-foreground">
                            Recibe resúmenes semanales y alertas importantes.
                        </span>
                    </div>
                    <Switch
                        id="email-notif"
                        checked={notifications.email}
                        onCheckedChange={(checked) => updateNotifications({ ...notifications, email: checked })}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="push-notif">Notificaciones Push</Label>
                        <span className="font-normal text-xs text-muted-foreground">
                            Recibe alertas en tiempo real en tu navegador.
                            {isConnected && <span className="text-green-500 ml-1">(Conectado)</span>}
                        </span>
                    </div>
                    <Switch
                        id="push-notif"
                        checked={notifications.push}
                        onCheckedChange={(checked) => updateNotifications({ ...notifications, push: checked })}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="marketing-notif">Comunicaciones de Marketing</Label>
                        <span className="font-normal text-xs text-muted-foreground">
                            Recibe novedades sobre nuevas funcionalidades.
                        </span>
                    </div>
                    <Switch
                        id="marketing-notif"
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => updateNotifications({ ...notifications, marketing: checked })}
                    />
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium">Resumen Semanal</span>
                        <span className="text-xs text-muted-foreground">
                            ¿No quieres esperar al lunes? Genera tu reporte ahora.
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTriggerReport}
                        disabled={isSendingReport}
                    >
                        {isSendingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Enviar Resumen Ahora
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
