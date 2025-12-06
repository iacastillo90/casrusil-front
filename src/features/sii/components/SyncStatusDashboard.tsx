import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useSIIStore } from "../stores/sii.store";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function SyncStatusDashboard() {
    const { lastSync, syncStatus, startSync } = useSIIStore();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Estado de Sincronización SII</CardTitle>
                <Badge variant={
                    syncStatus === 'SUCCESS' ? 'default' :
                        syncStatus === 'ERROR' ? 'destructive' : 'outline'
                }>
                    {syncStatus === 'IDLE' && 'En espera'}
                    {syncStatus === 'SYNCING' && 'Sincronizando...'}
                    {syncStatus === 'SUCCESS' && 'Sincronizado'}
                    {syncStatus === 'ERROR' && 'Error'}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            Última sincronización:
                        </div>
                        <div className="text-2xl font-bold">
                            {lastSync ? formatDate(lastSync) : 'Nunca'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Registro de Compras y Ventas (RCV)
                        </p>
                    </div>

                    <Button
                        onClick={() => startSync()}
                        disabled={syncStatus === 'SYNCING'}
                        size="lg"
                    >
                        <RefreshCw className={cn(
                            "mr-2 h-4 w-4",
                            syncStatus === 'SYNCING' && "animate-spin"
                        )} />
                        Sincronizar Ahora
                    </Button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Docs. Recibidos</span>
                        <span className="text-xl font-bold">124</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Docs. Emitidos</span>
                        <span className="text-xl font-bold">45</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Reclamados</span>
                        <span className="text-xl font-bold text-yellow-600">2</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
