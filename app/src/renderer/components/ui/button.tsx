// app/src/renderer/components/ui/button.tsx
//--------------------------------------------------------------
// Minimal, style-agnostic button (replace later with shadcn/ui)
//--------------------------------------------------------------
import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        const base =
            'px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50';
        const variants: Record<string, string> = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            ghost: 'bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700',
        };

        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], className)}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
