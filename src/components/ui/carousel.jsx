import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props} />
));

Carousel.displayName = "Carousel";

const CarouselContent = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex overflow-hidden scroll-smooth snap-x snap-mandatory",
      className
    )}
    {...props}
  />
));

CarouselContent.displayName = "CarouselContent";

const CarouselItem = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-none basis-full snap-start scroll-smooth",
      className
    )}
    {...props}
  />
));

CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-gray-100",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-5 w-5" />
  </button>
));

CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-gray-100",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-5 w-5" />
  </button>
));

CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };