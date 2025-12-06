"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankStatementUpload } from "@/features/treasury/components/BankStatementUpload";
import { ReconciliationInterface } from "@/features/treasury/components/ReconciliationInterface";
import { CashFlowChart } from "@/features/treasury/components/CashFlowChart";
import { LiquidityKPIs } from "@/features/treasury/components/LiquidityKPIs";

export default function TreasuryPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Tesorería y Bancos</h1>

            <Tabs defaultValue="reconciliation" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="reconciliation">Conciliación Bancaria</TabsTrigger>
                    <TabsTrigger value="cashflow">Flujo de Caja</TabsTrigger>
                </TabsList>

                <TabsContent value="reconciliation" className="space-y-4">
                    <BankStatementUpload />
                    <ReconciliationInterface />
                </TabsContent>

                <TabsContent value="cashflow" className="space-y-4">
                    <LiquidityKPIs />
                    <CashFlowChart />
                </TabsContent>
            </Tabs>
        </div>
    );
}
