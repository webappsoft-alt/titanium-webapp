import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';

const Combobox = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props}>
    {children}
  </div>
));

Combobox.displayName = "Combobox";

const ComboboxTrigger = forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronsUpDown className="h-4 w-4 opacity-50" />
  </button>
));

ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxContent = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

ComboboxContent.displayName = "ComboboxContent";

const ComboboxOption = forwardRef(({ className, children, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative cursor-default select-none py-2 pl-10 pr-4",
      selected ? "bg-gray-100" : "hover:bg-gray-50",
      className
    )}
    {...props}
  >
    <span className={cn("block truncate", selected ? "font-medium" : "font-normal")}>
      {children}
    </span>
    {selected && (
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Check className="h-4 w-4" />
      </span>
    )}
  </div>
));

ComboboxOption.displayName = "ComboboxOption";

export { Combobox, ComboboxTrigger, ComboboxContent, ComboboxOption };