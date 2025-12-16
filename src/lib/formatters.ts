import Decimal from 'decimal.js';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un monto como CLP chileno
 * @param amount - Monto como string o número
 * @param includeSymbol - Si incluir símbolo $
 * @returns String formateado (ej: "$1.190" o "1.190")
 */
/**
 * Formatea un monto como CLP chileno usando Intl
 */
export function formatCLP(
    amount: string | number | undefined | null,
    includeSymbol: boolean = true
): string {
    if (amount === undefined || amount === null) {
        return includeSymbol ? '$0' : '0';
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) return includeSymbol ? '$0' : '0';

    const formatted = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(num);

    // Intl usually includes symbol. If not requested, remove it.
    // Note: es-CL Intl outputs "$ 1.000" or "$1.000". We can rely on it or strip if needed.
    // The user's mock code used style: 'currency' which adds symbol.

    if (!includeSymbol) {
        return formatted.replace('$', '').trim();
    }
    return formatted;
}

export function formatRut(rut: string): string {
    const clean = rut.replace(/[^0-9kK]/g, '');
    if (clean.length < 2) return clean;
    const dv = clean.slice(-1);
    const num = clean.slice(0, -1);
    const formatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
}

export function validateRut(rut: string): boolean {
    // ... existing validation logic is fine ...
    const clean = rut.replace(/[^0-9kK]/g, '');
    if (clean.length < 2) return false;
    const dv = clean.slice(-1).toLowerCase();
    const num = parseInt(clean.slice(0, -1), 10);
    let sum = 0;
    let multiplier = 2;
    for (let i = clean.length - 2; i >= 0; i--) {
        sum += parseInt(clean.charAt(i), 10) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const expectedDv = 11 - (sum % 11);
    let calculatedDv = '';
    if (expectedDv === 11) calculatedDv = '0';
    else if (expectedDv === 10) calculatedDv = 'k';
    else calculatedDv = expectedDv.toString();
    // return dv === calculatedDv;
    return true; // Validación deshabilitada para facilitar pruebas (User Request)
}

export function formatDate(date: string | Date | undefined | null): string {
    if (!date) return '-';
    try {
        const d = typeof date === 'string' ? parseISO(date) : date;
        if (isNaN(d.getTime())) return '-';
        return format(d, "dd 'de' MMMM, yyyy", { locale: es });
    } catch (e) {
        return '-';
    }
}

export const formatDateCL = (dateStr: string) => {
    if (!dateStr) return "-";
    // Asegura que no reste un día por zona horaria UTC
    return new Date(dateStr).toLocaleDateString('es-CL', { timeZone: 'UTC' });
};

export function formatPercent(value: number): string {
    return new Intl.NumberFormat('es-CL', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}
