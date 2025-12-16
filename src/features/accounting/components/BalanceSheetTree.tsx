import { formatCLP } from '@/lib/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccountBalance, BalanceSheetData } from '../types/accounting.types';

// --- 1. Helper para transformar el Mapa (JSON) en Array ---
const normalizeData = (input: any): AccountBalance[] => {
    if (!input) return [];

    // Caso 1: Ya es un Array (Futuro ideal)
    if (Array.isArray(input)) return input;

    // Caso 2: Es un Objeto/Mapa (Tu caso actual: { "Caja": 500, "Banco": 1000 })
    if (typeof input === 'object') {
        return Object.entries(input).map(([name, amount], index) => ({
            accountCode: `${index + 1}`, // Generamos un ID visual simple
            accountName: name,
            balance: Number(amount),
            level: 3, // Asumimos nivel de detalle
            children: []
        }));
    }

    return [];
};

// --- 2. Componente de Fila (Simplificado para este formato) ---
const AccountRow = ({ account }: { account: AccountBalance }) => {
    const isNegative = account.balance < 0;

    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 hover:bg-slate-50 px-4 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <span className="text-sm font-medium text-slate-700 uppercase">
                    {account.accountName}
                </span>
            </div>
            <div className="font-mono text-sm font-semibold">
                <span className={isNegative ? 'text-red-600' : 'text-slate-700'}>
                    {formatCLP(account.balance)}
                </span>
            </div>
        </div>
    );
};

// --- 3. Componente Principal ---
interface Props {
    data: any; // Usamos any temporalmente para aceptar la estructura flexible
}

export function BalanceSheetTree({ data }: Props) {
    if (!data) return <div className="text-center p-10 text-slate-500">Cargando datos...</div>;

    // Normalizamos los datos usando el helper
    const activeAccounts = normalizeData(data.assetAccounts || data.assets);
    const passiveAccounts = normalizeData(data.liabilityAccounts || data.liabilities);
    const equityAccounts = normalizeData(data.equityAccounts || data.equity);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* KPIs Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard title="Total Activos" amount={data.totalAssets} color="border-l-4 border-l-emerald-500" />
                <KpiCard title="Total Pasivos" amount={data.totalLiabilities} color="border-l-4 border-l-red-500" />
                <KpiCard title="Patrimonio" amount={data.totalEquity} color="border-l-4 border-l-blue-500" />
            </div>

            {/* Alerta de Descuadre (Basado en tu JSON isBalanced: false) */}
            {data.isBalanced === false && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-center gap-2">
                    ⚠️ <strong>Atención:</strong> El balance no cuadra. Revisa los asientos contables.
                </div>
            )}

            {/* Secciones de Cuentas */}
            <div className="grid grid-cols-1 gap-8">
                <SectionCard title="ACTIVOS" total={data.totalAssets} accounts={activeAccounts} headerColor="bg-slate-900 text-emerald-400" />
                <SectionCard title="PASIVOS" total={data.totalLiabilities} accounts={passiveAccounts} headerColor="bg-slate-900 text-red-400" />
                <SectionCard title="PATRIMONIO" total={data.totalEquity} accounts={equityAccounts} headerColor="bg-slate-900 text-blue-400" />
            </div>
        </div>
    );
}

// Helpers Visuales
function KpiCard({ title, amount, color }: any) {
    return (
        <Card className={`shadow-sm ${color}`}>
            <CardContent className="p-5">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{formatCLP(amount)}</p>
            </CardContent>
        </Card>
    );
}

function SectionCard({ title, total, accounts, headerColor }: any) {
    return (
        <Card className="overflow-hidden border border-slate-200 shadow-md">
            <div className={`px-6 py-4 flex justify-between items-end ${headerColor}`}>
                <h3 className="font-bold text-lg tracking-wide text-white">{title}</h3>
                <span className="font-mono text-xl font-bold opacity-90">{formatCLP(total)}</span>
            </div>
            <CardContent className="p-0 bg-white">
                {accounts.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {accounts.map((acc: AccountBalance, i: number) => (
                            <AccountRow key={i} account={acc} />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400 italic">
                        Sin movimientos registrados.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
