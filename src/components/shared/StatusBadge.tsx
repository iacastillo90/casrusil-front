import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DTE_STATUS } from '@/lib/constants';

const statusConfig = {
    [DTE_STATUS.DRAFT]: { label: 'Borrador', variant: 'secondary' },
    [DTE_STATUS.SIGNED]: { label: 'Firmado', variant: 'default' },
    [DTE_STATUS.SENT]: { label: 'Enviado', variant: 'default' },
    [DTE_STATUS.ACCEPTED]: { label: 'Aceptado', variant: 'success' }, // Note: 'success' variant might need to be added to Badge or mapped to 'default' with custom class
    [DTE_STATUS.REJECTED]: { label: 'Rechazado', variant: 'destructive' },
} as const;

interface StatusBadgeProps {
    status: keyof typeof statusConfig;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    // Fallback for unknown status
    if (!config) {
        return (
            <Badge variant="outline" className={className}>
                {status}
            </Badge>
        );
    }

    // Handle custom variants if not supported by shadcn Badge directly
    const variant = config.variant === 'success' ? 'default' : config.variant;
    const customClass = config.variant === 'success' ? 'bg-green-500 hover:bg-green-600' : '';

    return (
        <Badge
            variant={variant}
            className={cn('font-medium', customClass, className)}
        >
            {config.label}
        </Badge>
    );
}
