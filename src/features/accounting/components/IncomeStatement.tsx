import { useQuery } from '@tanstack/react-query';
// getIncomeStatement removed since it is not exported as named export
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { formatCLP, formatPercent } from '@/lib/formatters';
import { Sparkles } from 'lucide-react'; // Icono para la IA
import { IncomeStatementData } from '../types/accounting.types';
import { accountingService } from '../services/accounting.service';

export function IncomeStatement({ selectedMonth, selectedYear }: { selectedMonth?: number, selectedYear: number }) {

    // 1. Hook Reactivo: Se recarga si cambia el mes/año
    const { data, isLoading, isError } = useQuery({
        queryKey: ['income-statement', selectedMonth, selectedYear],
        queryFn: () => accountingService.getIncomeStatement(selectedMonth, selectedYear)
    });

    if (isLoading) return <SkeletonLoader variant="table" />;
    if (isError || !data) return <div className="text-red-500">Error cargando reporte financiero.</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* SECCIÓN 1: EL ANALISTA IA (Nivel Dios) */}
            <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-indigo-500/30">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <Sparkles className="h-5 w-5 text-indigo-400 mr-2 animate-pulse" />
                    <CardTitle className="text-indigo-100 text-lg">AI Executive Insight</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-300 leading-relaxed italic">
                        "{data.aiAnalysis || 'Analizando tendencias de mercado y márgenes operativos...'}"
                    </p>
                </CardContent>
            </Card>

            {/* SECCIÓN 2: KPIs PRINCIPALES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard title="Ingresos Totales" amount={data.totalRevenue} color="text-emerald-500" />
                <KpiCard title="Margen Neto" amount={data.netIncomeMargin} isPercent color={data.netIncomeMargin > 0 ? "text-blue-500" : "text-red-500"} />
                <KpiCard title="Utilidad Neta" amount={data.netIncome} color={data.netIncome > 0 ? "text-emerald-400" : "text-red-400"} />
            </div>

            {/* SECCIÓN 3: LA TABLA DINÁMICA */}
            <Card>
                <CardHeader><CardTitle>Estado de Resultados (Detallado)</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <ReportRow label="Ingresos Operacionales" amount={data.totalRevenue} isBold />

                        {/* Mapeo dinámico de subcuentas */}
                        <div className="pl-4 space-y-2 border-l-2 border-slate-100">
                            {data.revenueBreakdown.map((item, idx) => (
                                <ReportRow key={idx} label={item.accountName} amount={item.amount} isSubItem percent={item.percentage} />
                            ))}
                        </div>

                        <ReportRow label="(-) Costo de Ventas" amount={data.totalCostOfSales} isNegative />
                        <div className="border-t border-slate-200 my-2" />
                        <ReportRow label="Utilidad Bruta" amount={data.grossProfit} isBold highlight />

                        <ReportRow label="(-) Gastos Operacionales" amount={data.totalOperatingExpenses} isNegative />
                        <div className="pl-4 space-y-2 border-l-2 border-slate-100">
                            {data.expenseBreakdown.map((item, idx) => (
                                <ReportRow key={idx} label={item.accountName} amount={item.amount} isSubItem percent={item.percentage} />
                            ))}
                        </div>

                        <div className="border-t-2 border-slate-800 my-4" />
                        <ReportRow label="UTILIDAD (PÉRDIDA) DEL EJERCICIO" amount={data.netIncome} isTotal />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Componentes Helper para mantener limpio el código principal
function ReportRow({ label, amount, isBold, isNegative, isTotal, isSubItem, percent, highlight }: any) {
    return (
        <div className={`flex justify-between items-center py-1 ${isTotal ? 'text-xl font-black mt-4' : ''} ${highlight ? 'bg-slate-50/5 p-2 rounded' : ''}`}>
            <span className={`${isBold ? 'font-semibold' : 'font-medium text-slate-500'} ${isSubItem ? 'text-sm' : ''}`}>
                {label} {percent !== undefined && <span className="text-xs text-slate-400 ml-2">({formatPercent(percent)})</span>}
            </span>
            <span className={`${isBold ? 'font-bold' : ''} ${isNegative ? 'text-red-500' : 'text-slate-700'}`}>
                {isNegative ? '-' : ''}{formatCLP(amount)}
            </span>
        </div>
    );
}

function KpiCard({ title, amount, isPercent, color }: any) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">{title}</div>
                <div className={`text-2xl font-bold ${color}`}>
                    {isPercent ? formatPercent(amount) : formatCLP(amount)}
                </div>
            </CardContent>
        </Card>
    );
}
