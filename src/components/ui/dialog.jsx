import { forwardRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

const contentVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 10
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] // Custom spring-like ease
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: { 
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

const Dialog = forwardRef(({ className, children, open = false, onClose, ...props }, ref) => {
  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (!open) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    // Prevent body scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className={cn(
            "fixed inset-0 z-50 overflow-y-auto",
            "overscroll-contain",
            className
          )}
          role="dialog"
          aria-modal="true"
          initial="hidden"
          animate="visible"
          exit="exit"
          {...props}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
            aria-hidden="true"
            variants={backdropVariants}
            onClick={(e) => {
              if (e.target === e.currentTarget && onClose) {
                onClose();
              }
            }}
          />

          {/* Dialog content wrapper */}
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto contents">
              {typeof children === 'function' ? children() : children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
Dialog.displayName = 'Dialog';

const DialogContent = forwardRef(({ className, children, onClose, closeButton = true, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "w-full max-w-lg overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl relative",
        "focus-within:outline-none",
        className
      )}
      variants={contentVariants}
      {...props}
    >
      {children}
      {closeButton && onClose && (
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </motion.div>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}
    {...props}
  />
));
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}
    {...props}
  />
));
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = forwardRef(({ className, as: Component = 'h3', ...props }, ref) => (
  <Component
    ref={ref}
    className={cn("text-lg font-medium leading-6 text-gray-900", className)}
    id="dialog-title"
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 mt-2", className)}
    id="dialog-description"
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogPanel = forwardRef(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "w-full max-w-lg overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl",
      className
    )}
    variants={contentVariants}
    {...props}
  >
    {children}
  </motion.div>
));
DialogPanel.displayName = 'DialogPanel';

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPanel
};