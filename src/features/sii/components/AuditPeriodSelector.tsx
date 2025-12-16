"use client";

import { useAuditStore } from "../stores/audit.store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AuditPeriodSelector() {
    const { selectedYear, selectedMonth, setPeriod } = useAuditStore();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedMonth.toString()}
                onValueChange={(val) => setPeriod(selectedYear, parseInt(val))}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                    {months.map((m, idx) => (
                        <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                            {m}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={selectedYear.toString()}
                onValueChange={(val) => setPeriod(parseInt(val), selectedMonth)}
            >
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
