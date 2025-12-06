"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyProfile } from "@/features/settings/components/CompanyProfile";
import { UserManagement } from "@/features/settings/components/UserManagement";
import { PersonalSettings } from "@/features/settings/components/PersonalSettings";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>

            <Tabs defaultValue="company" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="company">Empresa</TabsTrigger>
                    <TabsTrigger value="users">Usuarios</TabsTrigger>
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                </TabsList>

                <TabsContent value="company" className="space-y-4">
                    <CompanyProfile />
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <UserManagement />
                </TabsContent>

                <TabsContent value="personal" className="space-y-4">
                    <PersonalSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}
