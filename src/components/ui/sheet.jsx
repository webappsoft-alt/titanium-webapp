import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const Sheet = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/50", className)}
    {...props}
  />
));
Sheet.displayName = "Sheet";

const SheetContent = forwardRef(({ className, children, position = "right", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out",
      {
        "inset-y-0 right-0 h-full w-3/4 border-l": position === "right",
        "inset-y-0 left-0 h-full w-3/4 border-r": position === "left",
        "inset-x-0 bottom-0 h-96 border-t": position === "bottom",
        "inset-x-0 top-0 h-96 border-b": position === "top",
      },
      className
    )}
    {...props}
  >
    {children}
    <button
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100"
      onClick={() => props.onClose?.()}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  </div>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
));
SheetHeader.displayName = "SheetHeader";

const SheetTitle = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
};