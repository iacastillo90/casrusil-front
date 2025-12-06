"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AiDrawer } from "@/features/ai-assistant/components/AiDrawer";
import { useUiStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isSidebarCollapsed } = useUiStore();

    return (
        <div className="min-h-screen w-full">
            <Sidebar />
            <div className={cn("transition-all duration-300", isSidebarCollapsed ? "pl-16" : "pl-64")}>
                <Header />
                <main className="flex-1 p-4 pt-2 lg:px-6 lg:pb-6 lg:pt-2 mt-14 lg:mt-[60px]">
                    {children}
                </main>
                <AiDrawer />
            </div>
        </div>
    );
}
