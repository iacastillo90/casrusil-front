import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useChatStore } from "@/features/ai-assistant/stores/chat.store";
import { LogOut, Menu, Bot, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { useUiStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function Header() {
    const { user, logout } = useAuthStore();
    const { toggleOpen } = useChatStore();
    const { isSidebarCollapsed } = useUiStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        Cookies.remove("auth-token");
        router.push('/login');
    };

    return (
        <header className={cn(
            "flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 fixed top-0 right-0 left-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
            isSidebarCollapsed ? "md:left-16" : "md:left-64"
        )}>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar className="block w-full h-full border-r-0 relative" />
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1 flex items-center gap-4">
                {/* Search or Title could go here */}
                <h1 className="font-semibold text-lg">Dashboard</h1>
                <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Sincronizar
                </Button>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => toggleOpen()}>
                    <Bot className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">
                    {mounted ? (user?.name || "Usuario") : "Usuario"}
                </span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}
