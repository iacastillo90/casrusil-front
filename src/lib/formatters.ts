import Decimal from 'decimal.js';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un monto como CLP chileno
 * @param amount - Monto como string o número
 * @param includeSymbol - Si incluir símbolo $
 * @returns String formateado (ej: "$1.190" o "1.190")
 */
export function formatCLP(
    amount: string | number,
    includeSymbol: boolean = true
): string {
    const decimal = new Decimal(amount);
    const formatted = decimal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return includeSymbol ? `$${formatted}` : formatted;
}

/**
 * Formatea RUT chileno
 * @param rut - RUT sin formato (ej: "123456789")
 * @returns RUT formateado (ej: "12.345.678-9")
 */
export function formatRut(rut: string): string {
    // Remove non-alphanumeric
    const clean = rut.replace(/[^0-9kK]/g, '');

    if (clean.length < 2) return clean;

    const dv = clean.slice(-1);
    const num = clean.slice(0, -1);

    // Add dots every 3 digits from right
    const formatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formatted}-${dv}`;
}

/**
 * Valida formato de RUT chileno
 * @param rut - RUT a validar
 * @returns true si es válido
 */
export function validateRut(rut: string): boolean {
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

    return dv === calculatedDv;
}

export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, "dd 'de' MMMM, yyyy", { locale: es });
}
