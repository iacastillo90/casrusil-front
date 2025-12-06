import { AuditAlert } from "../types/accounting.types";
import { AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuditAlertsListProps {
    alerts: AuditAlert[];
}

export function AuditAlertsList({ alerts }: AuditAlertsListProps) {
    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">Todo en orden</h3>
                <p className="text-muted-foreground">No se han detectado inconsistencias contables.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
            ))}
        </div>
    );
}

function AlertCard({ alert }: { alert: AuditAlert }) {
    const severityStyles = {
        LOW: "border-blue-200 bg-blue-50 text-blue-900",
        MEDIUM: "border-yellow-200 bg-yellow-50 text-yellow-900",
        HIGH: "border-red-200 bg-red-50 text-red-900",
    };

    const icons = {
        LOW: Info,
        MEDIUM: AlertTriangle,
        HIGH: AlertCircle,
    };

    const Icon = icons[alert.severity];

    return (
        <div className={cn("p-4 rounded-lg border flex gap-4", severityStyles[alert.severity])}>
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
                <h4 className="font-semibold">{alert.type}</h4>
                <p className="text-sm">{alert.description}</p>
                {alert.suggestedAction && (
                    <p className="text-sm font-medium mt-2">
                        Sugerencia: {alert.suggestedAction}
                    </p>
                )}
            </div>
        </div>
    );
}
