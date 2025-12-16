'use client';

import { Suspense } from 'react';
import { FinancialShieldWidget } from '@/features/financial-shield/components/FinancialShieldWidget';
import { EcoScoreCard } from '@/features/sustainability/components/EcoScoreCard';
import { SalesChart } from '@/features/dashboard/components/SalesChart';
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed';
import { KPIGrid } from '@/features/dashboard/components/KPIGrid';
import { SkeletonLoader } from '../../../components/shared/SkeletonLoader';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

export default function DashboardPage() {
    useRealtimeNotifications();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header con Saludo */}
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Dashboard <span className="inline-block animate-bounce">🚀</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Centro de Comando Financiero & Sostenible
                    </p>
                </div>
            </div>

            {/* SECCIÓN 1: ESCUDO FINANCIERO (NIVEL DIOS) */}
            <div className="grid gap-6 grid-cols-1">
                <Suspense fallback={<SkeletonLoader variant="card" />}>
                    <FinancialShieldWidget />
                </Suspense>
            </div>

            {/* SECCIÓN 2: KPIs Clásicos */}
            <Suspense fallback={<SkeletonLoader variant="card" rows={1} />}>
                <KPIGrid />
            </Suspense>

            {/* SECCIÓN 3: Bento Grid Layout */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Gráfico de Ventas (Ocupa 2 columnas en pantallas grandes) */}
                <div className="md:col-span-2 xl:col-span-2">
                    <Suspense fallback={<SkeletonLoader variant="card" />}>
                        <SalesChart />
                    </Suspense>
                </div>

                {/* EcoScore (Destacado) */}
                <div className="md:col-span-1 xl:col-span-1">
                    <Suspense fallback={<SkeletonLoader variant="card" />}>
                        <EcoScoreCard />
                    </Suspense>
                </div>

                {/* Actividad Reciente */}
                <div className="md:col-span-1 xl:col-span-1">
                    <Suspense fallback={<SkeletonLoader variant="card" />}>
                        <RecentActivityFeed />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
