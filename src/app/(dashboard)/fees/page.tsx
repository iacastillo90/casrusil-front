"use client";

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { feeService } from '@/features/fees/services/fee.service';
import { FeeTable } from '@/features/fees/components/FeeTable';
import { FeeImportModal } from '@/features/fees/components/FeeImportModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeesPage() {
    const companyId = useAuthStore((state) => state.companyId);

    const { data: fees = [], isLoading } = useQuery({
        queryKey: ['fees', companyId],
        queryFn: () => feeService.getFees({ companyId: companyId! }),
        enabled: !!companyId,
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Boletas de Honorarios</h2>
                    <p className="text-muted-foreground">
                        Gestiona las boletas de honorarios electrónicos recibidas.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <FeeImportModal />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Boletas</CardTitle>
                </CardHeader>
                <CardContent>
                    <FeeTable fees={fees} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
