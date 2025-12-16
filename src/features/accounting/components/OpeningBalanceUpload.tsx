'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { accountingService } from '../services/accounting.service';
import { toast } from 'sonner';

export function OpeningBalanceUpload() {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                if (!text) return;

                const lines = text.split('\n');
                const parsedItems: { accountCode: string; accountName: string; debit: number; credit: number }[] = [];

                // Skip header if necessary, assuming data starts from line 0 or checking content
                for (const line of lines) {
                    const columns = line.split('\t');
                    if (columns.length < 6) continue; // Ensure enough columns

                    const accountCode = columns[0]?.trim();
                    const accountName = columns[1]?.trim() || '';
                    // Col 4: DEUDOR (Debit), Col 5: ACREEDOR (Credit)
                    // Remove dots for thousands separator if present
                    const debitRaw = columns[4]?.replace(/\./g, '').replace(/,/g, '.') || '0';
                    const creditRaw = columns[5]?.replace(/\./g, '').replace(/,/g, '.') || '0';

                    const debit = parseFloat(debitRaw);
                    const credit = parseFloat(creditRaw);

                    if (accountCode && (!isNaN(debit) || !isNaN(credit))) {
                        parsedItems.push({
                            accountCode,
                            accountName,
                            debit: isNaN(debit) ? 0 : debit,
                            credit: isNaN(credit) ? 0 : credit
                        });
                    }
                }

                if (parsedItems.length === 0) {
                    toast.error('No se encontraron datos válidos en el archivo.');
                    return;
                }

                await accountingService.setOpeningBalance(parsedItems);
                toast.success('Saldo inicial cargado exitosamente');
                window.location.reload(); // Refresh to show new balance

            } catch (error) {
                console.error('Error processing file:', error);
                toast.error('Error al procesar el archivo. Verifique el formato.');
            } finally {
                setIsUploading(false);
                // Reset input
                e.target.value = '';
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="flex items-center">
            <input
                type="file"
                accept=".txt"
                id="opening-balance-upload"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
            />
            <label htmlFor="opening-balance-upload">
                <Button variant="outline" size="sm" className="cursor-pointer" asChild disabled={isUploading}>
                    <span>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Cargar Saldo Inicial
                    </span>
                </Button>
            </label>
        </div>
    );
}
