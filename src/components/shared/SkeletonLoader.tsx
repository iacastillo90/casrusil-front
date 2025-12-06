import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
    variant?: 'table' | 'card' | 'form';
    rows?: number;
    className?: string;
}

export function SkeletonLoader({
    variant = 'card',
    rows = 3,
    className,
}: SkeletonLoaderProps) {
    if (variant === 'table') {
        return (
            <div className={cn('space-y-3', className)}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex space-x-4">
                        <Skeleton className="h-12 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'form') {
        return (
            <div className={cn('space-y-4', className)}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)} suppressHydrationWarning>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="rounded-lg border p-6">
                    <Skeleton className="mb-4 h-6 w-48" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ))}
        </div>
    );
}
