import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Alert = forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border p-4",
      {
        'bg-white text-gray-900': variant === 'default',
        'border-red-600 text-red-600': variant === 'destructive',
      },
      className
    )}
    {...props}
  />
));

Alert.displayName = "Alert";

const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));

AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };