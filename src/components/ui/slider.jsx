import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Slider = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-100">
      <div className="h-full w-full transform bg-gray-900 transition-all" />
    </div>
    <div
      className="absolute h-5 w-5 rounded-full border-2 border-gray-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      style={{ left: '50%' }}
    />
  </div>
));

Slider.displayName = "Slider";

export { Slider };