import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateInvoiceRequest } from "../types/invoice.types";
import { useCreateInvoice } from "../hooks/useInvoices";
import { Trash2, Plus } from "lucide-react";
import Decimal from "decimal.js";
import { formatCLP, formatRut, validateRut } from "@/lib/formatters";
import { useEffect } from "react";
import { ClientSearch } from "./ClientSearch";

const invoiceSchema = z.object({
    type: z.coerce.number(),
    folio: z.coerce.number(),
    issuerRut: z.string().refine(validateRut, "RUT inválido"),
    recipientRut: z.string().refine(validateRut, "RUT inválido"),
    recipientName: z.string().min(1, "Razón Social requerida"),
    issueDate: z.string(),
    lines: z.array(z.object({
        description: z.string().min(1, "Descripción requerida"),
        quantity: z.coerce.number().min(1, "Cantidad debe ser mayor a 0"),
        unitPrice: z.string().min(1, "Precio requerido").refine((val) => !isNaN(Number(val)), "Debe ser número"),
    })).min(1, "Debe agregar al menos una línea"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export function InvoiceForm() {
    const createInvoice = useCreateInvoice();

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            type: 33, // Factura Electrónica
            folio: 0,
            issuerRut: "",
            recipientRut: "",
            recipientName: "",
            issueDate: new Date().toISOString().split('T')[0],
            lines: [{ description: "", quantity: 1, unitPrice: "0" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lines",
    });

    const lines = watch("lines");

    // Calculate totals
    const totals = lines.reduce((acc, line) => {
        const qty = new Decimal(line.quantity || 0);
        const price = new Decimal(line.unitPrice || 0);
        const lineTotal = qty.times(price);
        return {
            net: acc.net.plus(lineTotal),
        };
    }, { net: new Decimal(0) });

    const netAmount = totals.net;
    const taxRate = new Decimal(0.19);
    const taxAmount = netAmount.times(taxRate);
    const totalAmount = netAmount.plus(taxAmount);

    const onSubmit = (data: InvoiceFormData) => {
        createInvoice.mutate(data);
    };

    // Format RUT on blur
    const handleRutBlur = (field: "issuerRut" | "recipientRut") => (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            setValue(field, formatRut(value));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Encabezado del Documento</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="type">Tipo DTE</Label>
                        <Input id="type" type="number" {...register("type")} />
                        {errors.type && <span className="text-xs text-destructive">{errors.type.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="folio">Folio</Label>
                        <Input id="folio" type="number" {...register("folio")} />
                        {errors.folio && <span className="text-xs text-destructive">{errors.folio.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="issueDate">Fecha Emisión</Label>
                        <Input id="issueDate" type="date" {...register("issueDate")} />
                        {errors.issueDate && <span className="text-xs text-destructive">{errors.issueDate.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="issuerRut">RUT Emisor</Label>
                        <Input
                            id="issuerRut"
                            {...register("issuerRut")}
                            onBlur={handleRutBlur("issuerRut")}
                            placeholder="12.345.678-9"
                        />
                        {errors.issuerRut && <span className="text-xs text-destructive">{errors.issuerRut.message}</span>}
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Cliente (Receptor)</Label>
                        <ClientSearch
                            onSelect={(client) => {
                                setValue("recipientRut", formatRut(client.rut));
                                setValue("recipientName", client.razonSocial);
                            }}
                            selectedClientRut={watch("recipientRut")}
                        />
                    </div>
                    <div className="space-y-2 hidden">
                        <Label htmlFor="recipientRut">RUT Receptor</Label>
                        <Input
                            id="recipientRut"
                            {...register("recipientRut")}
                        />
                    </div>
                    <div className="space-y-2 hidden">
                        <Label htmlFor="recipientName">Razón Social Receptor</Label>
                        <Input id="recipientName" {...register("recipientName")} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Detalle</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: "0" })}>
                        <Plus className="mr-2 h-4 w-4" /> Agregar Línea
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid gap-4 md:grid-cols-12 items-end">
                            <div className="md:col-span-6 space-y-2">
                                <Label>Descripción</Label>
                                <Input {...register(`lines.${index}.description`)} />
                                {errors.lines?.[index]?.description && <span className="text-xs text-destructive">{errors.lines[index]?.description?.message}</span>}
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label>Cant.</Label>
                                <Input type="number" {...register(`lines.${index}.quantity`)} />
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <Label>Precio Unit.</Label>
                                <Input type="number" step="0.01" {...register(`lines.${index}.unitPrice`)} />
                            </div>
                            <div className="md:col-span-1">
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {errors.lines && <span className="text-xs text-destructive">{errors.lines.message}</span>}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-end space-y-2">
                        <div className="flex justify-between w-48">
                            <span className="text-muted-foreground">Neto:</span>
                            <span className="font-medium">{formatCLP(netAmount.toString())}</span>
                        </div>
                        <div className="flex justify-between w-48">
                            <span className="text-muted-foreground">IVA (19%):</span>
                            <span className="font-medium">{formatCLP(taxAmount.toString())}</span>
                        </div>
                        <div className="flex justify-between w-48 border-t pt-2">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-lg">{formatCLP(totalAmount.toString())}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={createInvoice.isPending}>
                    {createInvoice.isPending ? "Guardando..." : "Emitir Factura"}
                </Button>
            </div>
        </form>
    );
}
