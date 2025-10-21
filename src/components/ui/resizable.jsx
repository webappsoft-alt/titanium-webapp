import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const ResizablePanel = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex", className)}
    {...props}
  >
    {children}
  </div>
));

ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300",
      className
    )}
    {...props}
  />
));

ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanel, ResizableHandle };