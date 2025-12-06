import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCLP } from "@/lib/formatters";

const data = [
    { date: '01/03', income: 4000, expense: 2400, balance: 1600 },
    { date: '02/03', income: 3000, expense: 1398, balance: 3210 },
    { date: '03/03', income: 2000, expense: 9800, balance: -4590 },
    { date: '04/03', income: 2780, expense: 3908, balance: -5718 },
    { date: '05/03', income: 1890, expense: 4800, balance: -8628 },
    { date: '06/03', income: 2390, expense: 3800, balance: -10038 },
    { date: '07/03', income: 3490, expense: 4300, balance: -10848 },
];

export function CashFlowChart() {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Proyección de Flujo de Caja</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip formatter={(value) => formatCLP(Number(value))} />
                            <Area type="monotone" dataKey="balance" stroke="#8884d8" fillOpacity={1} fill="url(#colorBalance)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
