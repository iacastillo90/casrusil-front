import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AccountingEntry } from "../types/accounting.types";
import { formatCLP, formatDate } from "@/lib/formatters";

interface LedgerTableProps {
    entries: AccountingEntry[];
    isLoading: boolean;
}

export function LedgerTable({ entries, isLoading }: LedgerTableProps) {
    const [date, setDate] = useState<Date>();

    if (isLoading) {
        return <div>Cargando libro mayor...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-[200px]">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Filtrar por cuenta" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las cuentas</SelectItem>
                            <SelectItem value="1101">1101 - Caja</SelectItem>
                            <SelectItem value="1102">1102 - Banco</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cuenta</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="text-right">Débito</TableHead>
                            <TableHead className="text-right">Crédito</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No hay movimientos registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            entries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{formatDate(entry.date)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{entry.accountCode}</span>
                                            <span className="text-xs text-muted-foreground">{entry.accountName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{entry.description}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600">
                                        {Number(entry.debit) > 0 ? formatCLP(entry.debit) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-red-600">
                                        {Number(entry.credit) > 0 ? formatCLP(entry.credit) : "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
