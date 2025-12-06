'use client';

import { Suspense } from 'react';
import { KPIGrid } from '@/features/dashboard/components/KPIGrid';
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed';
import { SalesChart } from '@/features/dashboard/components/SalesChart';
import { RecentInvoices } from '@/features/dashboard/components/RecentInvoices';
import { SkeletonLoader } from '../../../components/shared/SkeletonLoader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

export default function DashboardPage() {
    useRealtimeNotifications();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Resumen de tu situación financiera y contable
                </p>
            </div>

            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>⚠️ No estás conectado al SII</AlertTitle>
                <AlertDescription className="flex items-center gap-2">
                    Para activar la importación automática de facturas y el cálculo del F29, necesitas conectar tu Certificado Digital.
                    <Link href="/settings/company" className="font-medium underline underline-offset-4">
                        [Conectar Ahora]
                    </Link>
                </AlertDescription>
            </Alert>

            {/* KPI Cards */}
            <Suspense fallback={<SkeletonLoader variant="card" rows={1} />}>
                <KPIGrid />
            </Suspense>

            {/* Main Charts & Activity */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <Suspense fallback={<SkeletonLoader variant="card" />}>
                        <SalesChart />
                    </Suspense>
                </div>
                <div className="col-span-3">
                    <Suspense fallback={<SkeletonLoader variant="card" />}>
                        <RecentActivityFeed />
                    </Suspense>
                </div>
            </div>

            {/* Recent Invoices */}
            <div className="grid gap-6">
                <Suspense fallback={<SkeletonLoader variant="card" />}>
                    <RecentInvoices />
                </Suspense>
            </div>
        </div>
    );
}
