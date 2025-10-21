import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Popover = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props} />
));

Popover.displayName = "Popover";

const PopoverTrigger = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("inline-flex items-center justify-center", className)}
    {...props}
  />
));

PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  />
));

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };