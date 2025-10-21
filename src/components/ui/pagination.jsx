"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

// Size variants
const sizeVariants = {
  sm: "h-7 min-w-7 px-2 text-xs",
  md: "h-9 min-w-9 px-3 text-sm",
  lg: "h-11 min-w-11 px-4 text-base",
};

// Root Pagination
const Pagination = forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
));
Pagination.displayName = "Pagination";

// Wrapper for items
const PaginationContent = forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

// Single list item
const PaginationItem = forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

// Page link (numbered or prev/next)
const PaginationLink = forwardRef(
  ({ className, isActive, size = "md", children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={
        isActive
          ? { scale: 1.1,  }
          : { scale: 1 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        sizeVariants[size],
        isActive && "font-semibold shadow-sm bg-primary text-white rounded-full hover:bg-primary/85",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);
PaginationLink.displayName = "PaginationLink";

// Prev Button
const PaginationPrevious = forwardRef(({ className, size = "md", ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to previous page"
    size={size}
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className={cn(size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
    <span className="max-sm:hidden text-sm">Prev</span>
  </PaginationLink>
));
PaginationPrevious.displayName = "PaginationPrevious";

// Next Button
const PaginationNext = forwardRef(({ className, size = "md", ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to next page"
    size={size}
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span className="max-sm:hidden text-sm">Next</span>
    <ChevronRight className={cn(size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
  </PaginationLink>
));
PaginationNext.displayName = "PaginationNext";

// Ellipsis (...)
const PaginationEllipsis = ({ className, size = "md", ...props }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "flex items-center justify-center",
      sizeVariants[size],
      className
    )}
    {...props}
  >
    <MoreHorizontal className={cn(size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
    <span className="sr-only">More pages</span>
  </motion.span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
