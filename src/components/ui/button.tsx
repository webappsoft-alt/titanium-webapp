import React from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'main' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50',
          // Variant-specific styles
          {
            'bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90': variant === 'primary',
            'text-slate-900 hover:bg-slate-100/80 shadow-sm bg-[#0a1f3c] ': variant === 'main',
            'shadow-sm bg-slate-100 text-slate-900 hover:bg-slate-100/80': variant === 'secondary',
            'border border-slate-200 bg-white shadow-sm hover:bg-slate-100': variant === 'outline',
            'hover:bg-slate-100 hover:text-slate-900': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          // Size-specific styles
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6': size === 'lg',
          },
          className // Merges with provided className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };