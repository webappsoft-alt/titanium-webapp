import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const CheckBox = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center h-5 w-5 border rounded-md bg-white focus-within:ring-2 focus-within:ring-primary-500 hover:border-primary-500 transition duration-150",
        props['aria-invalid'] ? "border-[#dc3545] focus-within:ring-[#dc3545]" : "border-gray-300",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <input
        type="checkbox"
        className="absolute h-full w-full opacity-0 cursor-pointer"
        ref={ref}
        {...props}
      />
      <div
        className={cn(
          "pointer-events-none flex items-center justify-center h-full w-full",
          "checked:bg-primary-600 checked:border-primary-600 "
        )}
      >
        {props.checked && <Check className="h-4 w-4" />}
      </div>
    </div>
  );
});

CheckBox.displayName = "CheckBox";

export { CheckBox };
