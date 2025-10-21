import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '@/lib/redux/loginForm';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function MobileMenuItem({ item, level = 0, onClose, activePath }) {
  const { push } = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  // Check if this item or any of its children are active
  const isActive = activePath === (item?.slug ? `/product/${item.slug}` : item.value);
  const hasActiveChild = hasChildren && item.children.some(
    child => activePath === (child?.slug ? `/product/${child.slug}` : child.value)
  );

  // Automatically expand if a child is active
  useEffect(() => {
    if (hasActiveChild) {
      setIsExpanded(true);
    }
  }, [hasActiveChild]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (item?.value || item?.slug) {
      if (item?.value && item.value.startsWith('http')) {
        window.open(item.value);
      } else {
        push(item?.slug ? `/product/${item.slug}` : item.value);
      }
      onClose();
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center justify-between py-2 px-4 text-left transition-all",
          "hover:bg-gray-100 hover:text-primary rounded-lg my-1 mx-1", // Added rounded corners and margin
          level > 0 && "pl-4",
          isExpanded ? "bg-gray-50 rounded-lg" : "",
          (isActive || hasActiveChild) && "bg-primary/10 text-primary font-medium border-l-4 border-primary rounded-lg" // Active state with rounded corners
        )}
      >
        <span style={{ textTransform: 'capitalize' }} className={cn(
          "text-gray-900",
          level === 0 ? "font-semibold text-xs" : "text-xs",
          (isActive || hasActiveChild) && "text-primary" // Active text color
        )}>
          {item.label}
        </span>
        {hasChildren && (
          isExpanded ?
            <ChevronDown className={cn(
              "h-5 w-5 text-gray-500 transition-transform duration-300 rotate-180",
              (isActive || hasActiveChild) && "text-primary"
            )} /> :
            <ChevronRight className={cn(
              "h-5 w-5 text-gray-500 transition-transform duration-300",
              (isActive || hasActiveChild) && "text-primary"
            )} />
        )}
      </button>

      {hasChildren && isExpanded && (
        <div className="bg-gray-50 rounded-lg mx-3 my-1 transition-all duration-300 ease-in-out">
          {item.children.map((child, index) => (
            <MobileMenuItem
              key={index}
              item={child}
              level={level + 1}
              onClose={onClose}
              activePath={activePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileMenu({ isOpen, onClose }) {
  const menuData = useSelector(state => state.menu.items);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { push } = useRouter();

  // Get current path for active state
  const activePath = pathname

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

  const handleLogout = () => {
    dispatch(setLogout());
    push("/");
    toast.success("Logout successfully");
    onClose();
  };

  return (
    <div style={{ height: '100dvh' }} className={cn("fixed inset-0 z-[100] transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
      {/* Overlay - Clicking this will close the menu */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        style={{ height: '100dvh' }}
      />

      {/* Menu Container - Slide Animation */}
      <div
        className={cn(
          "absolute left-0 top-0 w-[300px] bg-white h-full shadow-xl transition-transform duration-300 ease-in-out rounded-r-2xl", // Added rounded right corners
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ height: '100dvh' }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the menu from closing it
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 rounded-tr-2xl">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full p-2 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto pb-safe p-2">
            <nav className="space-y-1 mt-2">
              {menuData.map((item, index) => (
                <MobileMenuItem
                  key={index}
                  item={item}
                  onClose={onClose}
                  activePath={activePath}
                />
              ))}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full flex items-center justify-start gap-2 py-3 px-4 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-xl"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </Button>
            </nav>
          </div>

          {/* Logout Button */}
          {/* <div className="mt-auto border-t border-gray-200 px-4 py-2"> */}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}