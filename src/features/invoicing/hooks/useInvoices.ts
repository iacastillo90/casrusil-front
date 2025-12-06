import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoice.service';
import { CreateInvoiceRequest, InvoiceFilters, Invoice, GetInvoicesResponse } from '../types/invoice.types';
import { toast } from 'sonner';

export const useInvoices = (filters: InvoiceFilters = {}) => {
    return useQuery({
        queryKey: ['invoices', filters],
        queryFn: () => invoiceService.getInvoices(filters),
    });
};

export const useInvoice = (id: string) => {
    return useQuery({
        queryKey: ['invoice', id],
        queryFn: () => invoiceService.getInvoiceById(id),
        enabled: !!id,
    });
};

export const useCreateInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateInvoiceRequest) => invoiceService.createInvoice(data),
        onMutate: async (newInvoice): Promise<{ previousInvoices: GetInvoicesResponse | undefined }> => {
            // 1. Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['invoices'] });

            // 2. Snapshot previous value
            const previousInvoices = queryClient.getQueryData<GetInvoicesResponse>(['invoices', {}]);

            // 3. Optimistically update
            queryClient.setQueryData(['invoices', {}], (old: GetInvoicesResponse | undefined) => {
                const netAmount = newInvoice.lines.reduce((acc, item) => acc + (parseFloat(item.unitPrice) * item.quantity), 0);

                const optimisticInvoice: Invoice = {
                    ...newInvoice,
                    id: 'temp-' + Date.now(),
                    status: 'DRAFT',
                    issueDate: newInvoice.issueDate || new Date().toISOString(),
                    netAmount: netAmount.toString(),
                    taxAmount: Math.round(netAmount * 0.19).toString(),
                    totalAmount: Math.round(netAmount * 1.19).toString(),
                    companyId: 'temp',
                    lines: newInvoice.lines.map((line, index) => ({
                        ...line,
                        id: `temp-line-${index}`,
                        lineTotal: (parseFloat(line.unitPrice) * line.quantity).toString()
                    }))
                };

                if (!old) return { invoices: [optimisticInvoice], total: 1, page: 1, pageSize: 10 };

                return {
                    ...old,
                    invoices: [optimisticInvoice, ...old.invoices],
                    total: old.total + 1
                };
            });

            // 4. Return context for rollback
            return { previousInvoices };
        },
        onError: (err: Error, newInvoice, context) => {
            // Rollback on error
            if (context?.previousInvoices) {
                queryClient.setQueryData(['invoices', {}], context.previousInvoices);
            }
            toast.error(`Error al crear factura: ${err.message}`);
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
        onSuccess: () => {
            toast.success('Factura creada exitosamente');
        },
    });
};
