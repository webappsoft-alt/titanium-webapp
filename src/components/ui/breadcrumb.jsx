import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Breadcrumb container
const Breadcrumb = forwardRef(({ className, ...props }, ref) => (
  <nav ref={ref} className={cn('flex', className)} {...props} />
));
Breadcrumb.displayName = 'Breadcrumb';

// Breadcrumb list (ordered list)
const BreadcrumbList = forwardRef(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn('flex flex-wrap items-center gap-1.5', className)} {...props} />
));
BreadcrumbList.displayName = 'BreadcrumbList';

// Breadcrumb item (list item)
const BreadcrumbItem = forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

// Breadcrumb link (must have href)
const BreadcrumbLink = forwardRef(({ className, href, ...props }, ref) => {
  if (!href) {
    console.error('BreadcrumbLink requires an `href` prop');
    return null;
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={cn('text-sm font-medium underline-offset-4 hover:underline', className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

// Breadcrumb separator (e.g., ChevronRight icon)
const BreadcrumbSeparator = ({ className, children = <ChevronRight className="h-4 w-4" />, ...props }) => (
  <span className={cn('text-gray-500', className)} {...props}>
    {children}
  </span>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

// Export components
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
};
