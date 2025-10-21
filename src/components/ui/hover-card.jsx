import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const HoverCard = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative inline-block", className)} {...props} />
));

HoverCard.displayName = "HoverCard";

const HoverCardTrigger = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("inline-flex items-center justify-center", className)}
    {...props}
  />
));

HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = forwardRef(({ className, align = "center", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-64 rounded-md border bg-white p-4 shadow-md outline-none animate-in zoom-in-90",
      {
        "data-[side=bottom]:slide-in-from-top-2": align === "center",
        "data-[side=left]:slide-in-from-right-2": align === "start",
        "data-[side=right]:slide-in-from-left-2": align === "end",
      },
      className
    )}
    {...props}
  />
));

HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };