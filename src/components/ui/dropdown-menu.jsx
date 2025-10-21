import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const DropdownMenu = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative inline-block text-left", className)} {...props} />
));

DropdownMenu.displayName = 'DropdownMenu';

const DropdownMenuTrigger = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex w-full justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500",
      className
    )}
    {...props}
  />
));

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
      className
    )}
    {...props}
  />
));

DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = forwardRef(({ className, inset, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));

DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-px my-1 bg-gray-200", className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

const DropdownMenuLabel = forwardRef(({ className, inset, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "px-4 py-2 text-sm font-semibold text-gray-900",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
};