import { cn } from '@/lib/utils';

export function Toaster({ className, ...props }) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-xs",
        className
      )}
      {...props}
    />
  );
}

export function Toast({ className, title, description, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border shadow-lg p-4",
        "data-[swipe=move]:transition-none",
        className
      )}
      {...props}
    >
      {title && <div className="text-sm font-semibold">{title}</div>}
      {description && <div className="text-sm opacity-90">{description}</div>}
    </div>
  );
}