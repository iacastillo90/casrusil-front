"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SyncStatusDashboard } from "@/features/sii/components/SyncStatusDashboard";
import { CAFUpload } from "@/features/sii/components/CAFUpload";

export default function SIIPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Integración SII</h1>

            <Tabs defaultValue="sync" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="sync">Sincronización</TabsTrigger>
                    <TabsTrigger value="caf">Administración de Folios (CAF)</TabsTrigger>
                </TabsList>

                <TabsContent value="sync" className="space-y-4">
                    <SyncStatusDashboard />
                </TabsContent>

                <TabsContent value="caf" className="space-y-4">
                    <CAFUpload />
                </TabsContent>
            </Tabs>
        </div>
    );
}
