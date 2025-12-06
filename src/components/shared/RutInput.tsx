'use client';

import { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatRut, validateRut } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface RutInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onValueChange?: (value: string) => void;
}

export const RutInput = forwardRef<HTMLInputElement, RutInputProps>(
    ({ className, onValueChange, onChange, ...props }, ref) => {
        const [isValid, setIsValid] = useState<boolean | null>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            const formatted = formatRut(value);
            e.target.value = formatted;

            // Validate only if has minimum length
            if (formatted.length >= 3) {
                setIsValid(validateRut(formatted));
            } else {
                setIsValid(null);
            }

            onValueChange?.(formatted);
            onChange?.(e);
        };

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type="text"
                    placeholder="12.345.678-9"
                    onChange={handleChange}
                    className={cn(
                        className,
                        isValid === false && 'border-red-500 focus-visible:ring-red-500',
                        isValid === true && 'border-green-500 focus-visible:ring-green-500'
                    )}
                    {...props}
                />
                {isValid === false && (
                    <p className="mt-1 text-xs text-red-500">RUT inválido</p>
                )}
            </div>
        );
    }
);

RutInput.displayName = 'RutInput';
