import { ToolData } from "../types/ai.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FileText, ArrowRight } from "lucide-react";
import { formatCLP } from "@/lib/formatters";
import Link from "next/link";

interface ToolOutputRendererProps {
    toolData: ToolData;
}

export function ToolOutputRenderer({ toolData }: ToolOutputRendererProps) {
    switch (toolData.type) {
        case 'INVOICE_PREVIEW':
            const invoice = toolData.data;
            return (
                <Card className="w-full max-w-sm mt-2 bg-card/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex justify-between items-center">
                            <span>Factura #{invoice.folio}</span>
                            <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'}>
                                {invoice.status}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{invoice.clientName}</p>
                                <p className="text-lg font-bold">{formatCLP(invoice.amount)}</p>
                            </div>
                        </div>
                        <Button size="sm" className="w-full" asChild>
                            <Link href={`/invoices/${invoice.id}`}>
                                Ver Detalle <ArrowRight className="ml-2 h-3 w-3" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            );

        case 'CHART_PREVIEW':
            const chart = toolData.data;
            return (
                <Card className="w-full mt-2 bg-card/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{chart.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chart.data}>
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            );

        case 'ACTION_BUTTONS':
            return (
                <div className="flex flex-wrap gap-2 mt-2">
                    {toolData.data.actions.map((action, index) => (
                        <Button key={index} variant={action.variant || 'default'} size="sm" asChild>
                            <Link href={action.action}>
                                {action.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            );

        default:
            return null;
    }
}
