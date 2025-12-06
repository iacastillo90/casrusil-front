import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "../stores/settings.store";
import { User, Bell } from "lucide-react";

export function PersonalSettings() {
    const { notifications, updateNotifications } = useSettingsStore();

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
                    <Label htmlFor="email-notif" className="flex flex-col space-y-1">
                        <span>Notificaciones por Email</span>
                        <span className="font-normal text-xs text-muted-foreground">
                            Recibe resúmenes semanales y alertas importantes.
                        </span>
                    </Label>
                    <Switch
                        id="email-notif"
                        checked={notifications.email}
                        onCheckedChange={(checked) => updateNotifications({ email: checked })}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="push-notif" className="flex flex-col space-y-1">
                        <span>Notificaciones Push</span>
                        <span className="font-normal text-xs text-muted-foreground">
                            Recibe alertas en tiempo real en tu navegador.
                        </span>
                    </Label>
                    <Switch
                        id="push-notif"
                        checked={notifications.push}
                        onCheckedChange={(checked) => updateNotifications({ push: checked })}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="marketing-notif" className="flex flex-col space-y-1">
                        <span>Comunicaciones de Marketing</span>
                        <span className="font-normal text-xs text-muted-foreground">
                            Recibe novedades sobre nuevas funcionalidades.
                        </span>
                    </Label>
                    <Switch
                        id="marketing-notif"
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => updateNotifications({ marketing: checked })}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
