import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-3",
      className
    )}
    {...props}
  />
));
Calendar.displayName = "Calendar";

const CalendarHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between px-2 py-1",
      className
    )}
    {...props}
  />
));
CalendarHeader.displayName = "CalendarHeader";

const CalendarTitle = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm font-medium",
      className
    )}
    {...props}
  />
));
CalendarTitle.displayName = "CalendarTitle";

const CalendarPrevButton = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "p-2 opacity-50 hover:opacity-100",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </button>
));
CalendarPrevButton.displayName = "CalendarPrevButton";

const CalendarNextButton = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "p-2 opacity-50 hover:opacity-100",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </button>
));
CalendarNextButton.displayName = "CalendarNextButton";

const CalendarGrid = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid grid-cols-7 gap-1",
      className
    )}
    {...props}
  />
));
CalendarGrid.displayName = "CalendarGrid";

const CalendarDay = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "h-9 w-9 rounded-md p-0 font-normal aria-selected:opacity-100",
      className
    )}
    {...props}
  />
));
CalendarDay.displayName = "CalendarDay";

export {
  Calendar,
  CalendarHeader,
  CalendarTitle,
  CalendarPrevButton,
  CalendarNextButton,
  CalendarGrid,
  CalendarDay
};