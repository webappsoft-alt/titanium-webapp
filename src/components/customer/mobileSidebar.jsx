import { useEffect } from "react";
import { QuickQuoteSidebar } from "../quote/quick-quote-sidebar";
import { cn } from "@/lib/utils";

export function CustomerMobileSidebar({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Hide scrollbar
    } else {
      document.body.style.overflow = ""; // Restore scrollbar
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div style={{ height: '100dvh' }} className={cn("fixed inset-0 z-[100] transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
      {/* Overlay - Clicking this will close the menu */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        style={{ height: '100dvh' }}
      />

      {/* Menu Container - Slide Animation */}
      <div
        className={cn(
          "absolute left-0 top-0  h-full shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ height: '100dvh' }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the menu from closing it
      >
        <QuickQuoteSidebar isHid={false} onClose={onClose} />
      </div>
    </div>
  );
}