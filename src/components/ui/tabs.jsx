import { forwardRef, createContext, useContext, useState, Children, cloneElement } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Create context for managing tab state
const TabsContext = createContext(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

const Tabs = forwardRef(({ className, value, onValueChange, defaultValue = 0, children, ...props }, ref) => {
  const [activeTab, setActiveTab] = useState(value !== undefined ? value : defaultValue);
  
  // Update internal state when value prop changes
  if (value !== undefined && activeTab !== value) {
    setActiveTab(value);
  }

  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: activeTab, onValueChange: handleTabChange }}>
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';

const TabsList = forwardRef(({ className, children, ...props }, ref) => {
  const { value } = useTabs();
  
  // Clone children to add active prop
  const enhancedChildren = Children.map(children, (child, index) => {
    return cloneElement(child, {
      active: value === index,
      value: index,
    });
  });

  return (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex items-center justify-start gap-2 p-1",
        className
      )}
      {...props}
    >
      {enhancedChildren}
    </div>
  );
});

TabsList.displayName = 'TabsList';

const TabsTrigger = forwardRef(({ className, active, value, children, ...props }, ref) => {
  const { onValueChange } = useTabs();

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active 
          ? "bg-blue-600 text-white" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = forwardRef(({ className, value, children, ...props }, ref) => {
  const { value: activeTab } = useTabs();
  const isActive = value === activeTab;

  if (!isActive) return null;

  return (
    <motion.div
      ref={ref}
      role="tabpanel"
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };