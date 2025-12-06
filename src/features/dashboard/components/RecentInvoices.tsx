'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { APP_ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import { useInvoices } from '@/features/invoicing/hooks/useInvoices';
import { Invoice } from '@/features/invoicing/types/invoice.types';
import { SkeletonLoader } from '../../../components/shared/SkeletonLoader';

export function RecentInvoices() {
    const { data: invoices, isLoading } = useInvoices();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Take only the last 5 invoices
    const recentInvoices = invoices?.invoices?.slice(0, 5) || [];

    if (!mounted || isLoading) {
        return <SkeletonLoader variant="card" />;
    }

    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Facturas Recientes</CardTitle>
                <Link href={APP_ROUTES.INVOICES}>
                    <Button variant="ghost" size="sm" className="gap-1">
                        Ver todas
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {recentInvoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <FileText className="mb-2 h-8 w-8 opacity-50" />
                        <p>No hay facturas recientes</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentInvoices.map((invoice: Invoice) => (
                            <div
                                key={invoice.id}
                                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                            >
                                <div className="space-y-1">
                                    <p className="font-medium leading-none">
                                        {invoice.recipientName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Folio #{invoice.folio} • {formatDate(invoice.issueDate)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={invoice.status} />
                                    <CurrencyDisplay
                                        amount={invoice.totalAmount}
                                        className="font-semibold"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
