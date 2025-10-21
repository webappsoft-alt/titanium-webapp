import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const FormFeedback = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "text-xs mt-1 text-[#dc3545]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

FormFeedback.displayName = "FormFeedback";

export { FormFeedback };