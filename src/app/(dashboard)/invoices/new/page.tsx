"use client";

import { InvoiceForm } from "@/features/invoicing/components/InvoiceForm";

export default function NewInvoicePage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Nueva Factura</h1>
            </div>

            <InvoiceForm />
        </div>
    );
}
