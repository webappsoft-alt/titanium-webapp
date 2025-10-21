import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Collapsible = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));

Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));

CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand",
      className
    )}
    {...props}
  />
));

CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };