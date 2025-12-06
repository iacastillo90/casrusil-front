"use client";


import { useInvoices } from "@/features/invoicing/hooks/useInvoices";
import { InvoiceTable } from "@/features/invoicing/components/InvoiceTable";
import { CsvImportModal } from "@/features/invoicing/components/CsvImportModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { invoiceService } from "@/features/invoicing/services/invoice.service";
import { toast } from "sonner";

export default function InvoicesPage() {
    const { data, isLoading } = useInvoices({ page: 1, pageSize: 20 });
    const router = useRouter();

    const handleView = (id: string) => {
        router.push(`/invoices/${id}`);
    };

    const handleSend = async (id: string) => {
        try {
            await invoiceService.sendInvoice(id);
            toast.success("Factura enviada al SII exitosamente");
        } catch (error) {
            toast.error("Error al enviar factura");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
                <div className="flex gap-2">
                    <CsvImportModal />
                    <Link href="/invoices/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nueva Factura
                        </Button>
                    </Link>
                </div>
            </div>

            <InvoiceTable
                invoices={data?.invoices || []}
                isLoading={isLoading}
                onView={handleView}
                onSend={handleSend}
            />
        </div>
    );
}
