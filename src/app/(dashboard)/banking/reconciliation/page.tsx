import { Metadata } from "next";
import { ReconciliationInterface } from "@/features/treasury/components/ReconciliationInterface";

export const metadata: Metadata = {
    title: "Conciliación Bancaria | SII ERP AI",
    description: "Advanced bank reconciliation with AI matching",
};

export default function BankReconciliationPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                        Conciliación Bancaria Inteligente
                    </h2>
                    <p className="text-muted-foreground">
                        Connect bank statements with ERP records using AI-powered matching.
                    </p>
                </div>
            </div>

            <div className="h-full">
                <ReconciliationInterface />
            </div>
        </div>
    );
}
