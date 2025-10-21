import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const RadioGroup = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));

RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="radio"
    className={cn(
      "aspect-square h-4 w-4 rounded-full border border-gray-200 text-gray-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <div className="h-2.5 w-2.5 rounded-full bg-current" />
  </button>
));

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };