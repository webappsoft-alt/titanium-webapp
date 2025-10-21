import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const RadioButton = forwardRef(({ className, checked, ...props }, ref) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="radio"
        className="sr-only peer"
        ref={ref}
        checked={checked}
        {...props}
      />
      <div
        className={cn(
          "h-4 w-4 flex items-center justify-center border rounded-full transition duration-150",
          checked ? "border-primary-600 bg-primary-600" : "border-gray-300 bg-white",
          "peer-focus:ring-2 peer-focus:ring-primary-500 hover:border-primary-500",
          props['aria-invalid'] ? "border-[#dc3545] peer-focus:ring-[#dc3545]" : "",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {checked && <div className="h-2 w-2 bg-slate-500 rounded-full" />}
      </div>
    </label>
  );
});

RadioButton.displayName = "RadioButton";

export { RadioButton };
