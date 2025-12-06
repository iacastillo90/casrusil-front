"use client";

import { FixedAssetsList } from "@/features/accounting/components/FixedAssetsList";
import { DepreciationCalculator } from "@/features/accounting/components/DepreciationCalculator";

export default function AssetsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Activos Fijos</h1>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <FixedAssetsList />
                </div>
                <div>
                    <DepreciationCalculator />
                </div>
            </div>
        </div>
    );
}
