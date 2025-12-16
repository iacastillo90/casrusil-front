"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuditAlerts } from "@/features/accounting/hooks/useAccounting";
import { AuditAlertsList } from "@/features/accounting/components/AuditAlertsList";
import { Badge } from "@/components/ui/badge";

export function NotificationsMenu() {
    const { data: alerts = [], isLoading } = useAuditAlerts();
    const notificationCount = alerts.length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold leading-none">Notificaciones</h4>
                        <Badge variant="secondary" className="text-xs">
                            {notificationCount} nuevas
                        </Badge>
                    </div>
                </div>
                <div className="max-h-[80vh] overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="text-sm text-center py-4 text-muted-foreground">Cargando alertas...</div>
                    ) : (
                        <div className="space-y-4">
                            <AuditAlertsList alerts={alerts} />
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
