import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { path: '/customer/dashboard', label: 'DASHBOARD' },
  { path: '/customer/quick-quote', label: 'QUICK QUOTE APP', active: true },
  { path: '/customer/mill-products', label: 'MILL PRODUCTS' },
  { path: '/customer/services', label: 'SUPPLY SOLUTIONS' },
  { path: '', label: 'ACCOUNT HISTORY' },
  { path: '/customer/quotes', label: 'QUOTES' },
  { path: '/customer/orders', label: 'ORDERS' },
  { path: '', label: 'INVOICES' },
  { path: '', label: 'REPORTS' },
  { label: 'SUPPORT:', isHeader: true },
  { path: '/customer/faq', label: 'FAQ' },
  { path: '/customer/terms', label: 'TERMS & CONDITIONS' },
  { path: '', label: 'LEAD TIME' },
  { path: '', label: 'LIVE CHAT' },
  { label: '1-888-TITANIUM', isHeader: true, href: true },
  { label: '(1-888-482-6486)', isHeader: true, href: true }
];

export function QuickQuoteSidebar({ onClose, isHid = true }) {
  const pathname = usePathname()
  return (
    <aside className={`w-full min-h-[100vh] min-w-[200px] max-w-[250px] min-[2000px]:fixed  ${isHid ? 'max-lg:hidden' : ''} bg-[#0A1F3C] text-white overflow-auto`}>
      {!isHid && <div className="flex items-center justify-between p-4 border-b sticky top-0 z-10">
        <h2 className="text-lg font-semibold">Menu</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-gray-100 rounded-full p-2"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>}
      <nav className="py-4  sticky top-0">
        {menuItems.map((item, index) => (
          item.isHeader ? (
            item?.href ?
              <div key={index}>
                <Link
                  href={`tel:${item.label}`}
                  className="px-4 py-2 text-sm font-semibold text-gray-400"
                >
                  {item.label}
                </Link>
              </div> :
              <div
                key={index}
                className="px-4 py-2 text-sm font-semibold text-gray-400"
              >
                {item.label}
              </div>
          ) : (item.path ?
            <Link
              key={index}
              href={item.path || '#'}
              onClick={() => item.path && onClose?.()}
              className={`block w-full text-left text px-4 py-2 text-sm hover:bg-[#1B365D] transition-colors ${pathname === item.path ? 'bg-[#1B365D] font-semibold' : ''
                }`}
            >
              {item.label}
            </Link> : null
          )
        ))}
      </nav>
    </aside>
  );
}