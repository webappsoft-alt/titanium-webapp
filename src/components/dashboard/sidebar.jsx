'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Menu,
  User,
  ActivitySquareIcon,
  FileText,
  Edit,
  RefreshCcw,
  CreditCard,
  KeyRound,
} from "lucide-react";
import ApiFunction from "@/lib/api/apiFuntions";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";
import dynamic from "next/dynamic";
const QuotationGenerator = dynamic(() => import("../admin/quote-pdf"), { ssr: false });

const sidetabsData = (name) => (name === 'customer' ? [
  { name: "Account", onClick: false, icon: User, path: null },
  { name: "Addresses", onClick: false, icon: User, path: 'addresses' },
  { name: "Change Password", onClick: false, icon: KeyRound, path: 'password' },
  { name: "Activity", onClick: false, icon: ActivitySquareIcon, path: "activty" },
] : [
  { name: "Cart", onClick: false, icon: Edit, path: 'cart' },
  { name: "Customer", onClick: false, icon: User, path: 'customer' },
  { name: "Payment", onClick: false, icon: CreditCard, path: 'payment' },
  { name: "State Changes", onClick: false, icon: RefreshCcw, path: "state-change" },
]);
const Sidebar = ({ userPer, userData, children }) => {
  const pathname = usePathname();
  const { push, replace } = useRouter();
  const [quoteData, setQuoteData] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams)
  const { get } = ApiFunction()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const validPath = [{ path: '/dashboard/customers/edit', name: 'customer' },
  { path: '/dashboard/sales-order/', name: 'quote' },
  { path: '/dashboard/open-quotes/', name: 'quote' },
  { path: '/dashboard/close-quotes/', name: 'quote' },
  ]

  const rightSideData = validPath.find(item => pathname.startsWith(item.path)) || null;
  let rightSidetabs = [...sidetabsData(rightSideData?.name)]
  // Toggle expand state for menu items
  const toggleExpand = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Filter user-permitted tabs
  const filteredTabs = userPer.filter((item) =>
    item.roles?.includes(userData?.permissions || userData?.type)
  );

  // Detect active route & expand parent menu if child is active
  useEffect(() => {
    const currentPath = pathname.replace("/dashboard/", "");

    // Expand parent if child is active
    filteredTabs.forEach((tab) => {
      if (tab.children?.some((child) => currentPath.startsWith(child.path))) {
        setExpanded((prev) => ({ ...prev, [tab.name]: true }));
      }
    });

    // Set selected index
    const index = filteredTabs.findIndex((tab) => tab.path === currentPath);
    if (index !== -1) setSelectedIndex(index);
  }, [pathname, userPer]);
  const handleGet = useCallback(async () => {
    const id = pathname.replace('/dashboard/customers/edit/', '')
    await get(`quotation/open-quote/${id}`)
      .then((result) => {
        // Check if the object already exists
        const existingTab = rightSidetabs.find(tab => tab.name === "Open Quote");

        if (result.success) {
          // If the tab doesn't exist, push the new object
          setQuoteData(result?.data)
          if (!existingTab) {
            rightSidetabs.push({ name: "Open Quote", icon: FileText, path: "open-quote", onClick: true });
          }
        }
      }).catch((err) => {
        console.log(err)
      });
  }, [rightSideData])
  useEffect(() => {
    if (rightSideData?.name === 'customer') {
      handleGet()
    } else {
      const existingTab = rightSidetabs.find(tab => tab.name === "Open Quote");

      // If the tab exists, remove it
      if (existingTab) {
        rightSidetabs = rightSidetabs.filter(tab => tab.name !== "Open Quote");
      }
    }
  }, [rightSideData]);
  const quoteButtonRef = useRef();
  const handleTabChange = (path) => {
    push(path ? `/dashboard/${path}` : "/dashboard/overview");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 📱 Mobile SidebarLayout */}
      <div className="lg:hidden mb-6 relative">
        <button
          className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-lg shadow"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span>{filteredTabs[selectedIndex]?.name || "Menu"}</span>
          <Menu className="h-5 w-5" />
        </button>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 p-2 bg-white shadow-lg rounded-lg z-50"
          >
            {filteredTabs.map((tab, index) => (
              <div key={index}>
                {/* Parent Item */}
                <button
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium ${pathname.includes(tab.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    if (tab.children) {
                      toggleExpand(tab.name); // Toggle children visibility
                    } else {
                      handleTabChange(tab.path); // Navigate if no children
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </div>
                  {tab.children &&
                    (expanded[tab.name] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </button>

                {/* Child Items */}
                {tab.children && expanded[tab.name] && (
                  <div className="ml-6 space-y-2">
                    {tab.children.map((child, childIndex) => (
                      <button
                        key={childIndex}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${pathname.includes(child.path)
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                        onClick={() => handleTabChange(child.path)}
                      >
                        <span>•</span> {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
      {/* 🖥️ Desktop SidebarLayout */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {filteredTabs.map((tab, index) => (
                <div key={index}>
                  {/* Parent Menu Item */}
                  <button
                    onClick={() =>
                      tab.children
                        ? toggleExpand(tab.name)
                        : handleTabChange(tab.path)
                    }
                    className={`w-full flex items-center justify-between text-start px-4 py-3 rounded-md text-sm font-medium transition ${pathname.includes(tab.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <tab.icon className="h-5 w-5" />
                      <span className="line-clamp-1">{tab.name}</span>
                    </div>
                    {tab.children &&
                      (expanded[tab.name] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      ))}
                  </button>

                  {/* Submenu Items (Expandable) */}
                  {tab.children && expanded[tab.name] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-6 space-y-2 overflow-hidden"
                    >
                      {tab.children.map((child, innerIndex) => (
                        <Link
                          key={innerIndex}
                          href={`/dashboard/${child.path}`}
                          className={`w-full flex items-center line-clamp-1 gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${pathname.includes(child.path)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          <span>•</span> {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
        {rightSideData && (
          <div className=" lg:hidden">
            <div className="bg-white rounded-lg shadow-sm p-2">
              <nav className="space-y-2 flex gap-3 items-center flex-wrap">
                {rightSidetabs.map((tab, index) => (
                  <div key={index}>
                    {/* Parent Menu Item */}
                    {tab?.path === 'open-quote' ? <QuotationGenerator quotationData={quoteData} tab={tab} /> :

                      <button
                        onClick={() =>
                          replace(`${pathname}${tab?.path ? `q=${tab?.path}` : ""}`)
                        }
                        className={`flex items-center justify-between text-start px-4 py-3 rounded-md text-sm font-medium transition ${params.get("q") === tab.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <tab.icon className="h-4 w-4" />
                          <span className="line-clamp-1 text-sm">{tab.name}</span>
                        </div>
                      </button>}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
        <div
          className={`${rightSideData ? "lg:col-span-7 md:col-span-9" : "lg:col-span-9"
            } overflow-x-auto `}
        >
          <div className="rounded-lg bg-white p-2 md:p-6 shadow-sm w-full">
            {children}
          </div>
        </div>
        {rightSideData && (
          <div className="lg:col-span-2  col-span-3 max-lg:hidden">
            <div className="bg-white rounded-lg shadow-sm p-2">
              <nav className="space-y-2">
                {rightSidetabs.map((tab, index) => (
                  <div key={index}>
                    {/* Parent Menu Item */}
                    {tab?.path === 'open-quote' ? <QuotationGenerator quotationData={quoteData} tab={tab} /> :
                      <button
                        onClick={() => {
                          // If other params exist, just update or set "q"
                          params.set('q', tab?.path);

                          replace(`${pathname}?${params.toString()}`);
                        }}

                        className={`w-full flex items-center justify-between text-start px-4 py-3 rounded-md text-sm font-medium transition ${params.get("q") === tab.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <tab.icon className="h-4 w-4" />
                          <span className="line-clamp-1 text-sm">{tab.name}</span>
                        </div>
                      </button>}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const SidebarLayout = ({ userPer, userData, children }) => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Sidebar userData={userData} userPer={userPer} children={children} />
      </Suspense>
    </>
  )
}

export default SidebarLayout;
