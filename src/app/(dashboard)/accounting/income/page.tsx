"use client";

import { useState } from "react";
import { IncomeStatement } from "@/features/accounting/components/IncomeStatement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function IncomeStatementPage() {
    const [selectedYear, setSelectedYear] = useState<string>("2025");
    const [selectedMonth, setSelectedMonth] = useState<string>("all");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Estado de Resultados</h1>

                <div className="flex gap-4">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todo el Año</SelectItem>
                            <SelectItem value="1">Enero</SelectItem>
                            <SelectItem value="2">Febrero</SelectItem>
                            <SelectItem value="3">Marzo</SelectItem>
                            <SelectItem value="4">Abril</SelectItem>
                            <SelectItem value="5">Mayo</SelectItem>
                            <SelectItem value="6">Junio</SelectItem>
                            <SelectItem value="7">Julio</SelectItem>
                            <SelectItem value="8">Agosto</SelectItem>
                            <SelectItem value="9">Septiembre</SelectItem>
                            <SelectItem value="10">Octubre</SelectItem>
                            <SelectItem value="11">Noviembre</SelectItem>
                            <SelectItem value="12">Diciembre</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <IncomeStatement
                selectedYear={parseInt(selectedYear)}
                selectedMonth={selectedMonth === "all" ? undefined : parseInt(selectedMonth)}
            />
        </div>
    );
}
