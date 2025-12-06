"use client";

import { AuditAlertsList } from "@/features/accounting/components/AuditAlertsList";
import { AccountValidationRules } from "@/features/accounting/components/AccountValidationRules";
import { useAuditAlerts } from "@/features/accounting/hooks/useAccounting";

export default function AuditPage() {
    const { data: alerts } = useAuditAlerts();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Auditoría y Validación</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <AuditAlertsList alerts={alerts || []} />
                <AccountValidationRules />
            </div>
        </div>
    );
}
