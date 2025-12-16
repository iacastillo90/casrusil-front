import { Metadata } from "next";
import { PartnerLedger } from "@/features/accounting/components/partner-ledger";

export const metadata: Metadata = {
    title: "Cuentas Corrientes | SII ERP AI",
    description: "Manage customer and supplier debts",
};

export default function PartnerLedgerPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-slate-800 dark:from-blue-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Cuentas Corrientes
                    </h2>
                    <p className="text-muted-foreground">
                        Control de deudas de Clientes y Proveedores en tiempo real.
                    </p>
                </div>
            </div>

            <div className="h-full">
                <PartnerLedger />
            </div>
        </div>
    );
}
