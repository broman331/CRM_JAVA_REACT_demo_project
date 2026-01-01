import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);
