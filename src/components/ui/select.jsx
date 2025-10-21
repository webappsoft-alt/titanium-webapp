import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Select Component
const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
      props['aria-invalid'] ? "border-[#dc3545] focus-visible:ring-[#dc3545]" : "border-gray-300",
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";

// SelectOption Component
const SelectOption = forwardRef(({ className, ...props }, ref) => (
  <option
    ref={ref}
    className={cn("text-sm", className)}
    {...props}
  />
));

SelectOption.displayName = "SelectOption";

export { Select, SelectOption };
