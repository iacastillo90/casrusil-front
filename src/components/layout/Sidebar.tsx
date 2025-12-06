'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Calculator,
    Cloud,
    Wallet,
    FileBarChart,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_ROUTES } from '@/lib/constants';
import { useUiStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navigation = [
    { name: 'Dashboard', href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Facturas', href: APP_ROUTES.INVOICES, icon: FileText },
    {
        name: 'Contabilidad',
        icon: Calculator,
        children: [
            { name: 'Libro Diario', href: APP_ROUTES.ACCOUNTING_LEDGER },
            { name: 'Form 29', href: APP_ROUTES.ACCOUNTING_F29 },
            { name: 'Balance', href: APP_ROUTES.ACCOUNTING_BALANCE },
            { name: 'Estado Resultados', href: APP_ROUTES.ACCOUNTING_INCOME },
            { name: 'Auditoría', href: APP_ROUTES.ACCOUNTING_AUDIT },
        ]
    },
    {
        name: 'SII',
        icon: Cloud,
        children: [
            { name: 'Sincronizar', href: APP_ROUTES.SII_SYNC },
            { name: 'CAF', href: APP_ROUTES.SII_CAF },
        ]
    },
    { name: 'Tesorería', href: APP_ROUTES.BANKING_RECONCILIATION, icon: Wallet },
    { name: 'Reportes', href: '/reports', icon: FileBarChart },
    { name: 'Configuración', href: APP_ROUTES.SETTINGS_COMPANY, icon: Settings },
];

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { isSidebarCollapsed, toggleSidebar } = useUiStore();

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
                isSidebarCollapsed ? 'w-16' : 'w-64',
                className
            )}
        >
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className={cn("flex h-16 items-center border-b px-4", isSidebarCollapsed ? "justify-center" : "justify-between")}>
                    <Link href={APP_ROUTES.DASHBOARD} className="flex items-center space-x-2 overflow-hidden">
                        <Calculator className="h-6 w-6 shrink-0" />
                        {!isSidebarCollapsed && <span className="text-lg font-bold whitespace-nowrap">SII-ERP-AI</span>}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
                    <TooltipProvider delayDuration={0}>
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.children ? (
                                    <div className="space-y-1">
                                        {!isSidebarCollapsed && (
                                            <div className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </div>
                                        )}
                                        <div className={cn("space-y-1", !isSidebarCollapsed && "ml-8")}>
                                            {item.children.map((child) => (
                                                <Tooltip key={child.href}>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={child.href}
                                                            className={cn(
                                                                'block rounded-md px-3 py-2 text-sm transition-colors',
                                                                pathname === child.href
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                                                isSidebarCollapsed && 'flex justify-center'
                                                            )}
                                                        >
                                                            {isSidebarCollapsed ? (
                                                                <span className="text-xs font-bold">{child.name.substring(0, 2)}</span>
                                                            ) : (
                                                                child.name
                                                            )}
                                                        </Link>
                                                    </TooltipTrigger>
                                                    {isSidebarCollapsed && (
                                                        <TooltipContent side="right">
                                                            {child.name}
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                                    pathname === item.href
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                                    isSidebarCollapsed && 'justify-center'
                                                )}
                                            >
                                                <item.icon className="h-5 w-5 shrink-0" />
                                                {!isSidebarCollapsed && <span>{item.name}</span>}
                                            </Link>
                                        </TooltipTrigger>
                                        {isSidebarCollapsed && (
                                            <TooltipContent side="right">
                                                {item.name}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                )}
                            </div>
                        ))}
                    </TooltipProvider>
                </nav>

                {/* Collapse Toggle */}
                <div className="border-t p-2 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                        {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </aside>
    );
}
