import { formatCLP } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface CurrencyDisplayProps {
    amount: string | number;
    className?: string;
    showSymbol?: boolean;
    variant?: 'default' | 'positive' | 'negative';
}

export function CurrencyDisplay({
    amount,
    className,
    showSymbol = true,
    variant = 'default',
}: CurrencyDisplayProps) {
    const formatted = formatCLP(amount, showSymbol);

    return (
        <span
            className={cn(
                'font-mono',
                variant === 'positive' && 'text-green-600',
                variant === 'negative' && 'text-red-600',
                className
            )}
        >
            {formatted}
        </span>
    );
}
