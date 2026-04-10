'use client'
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Menu,
  User,
  ActivitySquareIcon,
  FileText,
  Edit,
  RefreshCcw,
  CreditCard,
  KeyRound,
  Maximize2,
  Minimize2,
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
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openFlyout, setOpenFlyout] = useState(null);
  const validPath = [
    { path: "/dashboard/customers/edit/", name: "customer" },
    { path: "/dashboard/sales-order/", name: "quote" },
    { path: "/dashboard/open-quotes/", name: "quote" },
    { path: "/dashboard/close-quotes/", name: "quote" },
  ];

  // derive once
  const rightSideData = useMemo(() => {
    return validPath.find(item => pathname.startsWith(item.path)) || null;
  }, [pathname]);
  const customerId = useMemo(() => {
    if (rightSideData?.name !== "customer") return null;
    return pathname.replace("/dashboard/customers/edit/", "");
  }, [pathname, rightSideData]);

  // prevent refetch same id
  const lastFetchedId = useRef(null);
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
  const handleGet = useCallback(async (id) => {
    if (!id || lastFetchedId.current === id) return;
    lastFetchedId.current = id;
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
    if (rightSideData?.name === "customer" && customerId) {
      handleGet(customerId)
    } else {
      const existingTab = rightSidetabs.find(tab => tab.name === "Open Quote");

      // If the tab exists, remove it
      if (existingTab) {
        rightSidetabs = rightSidetabs.filter(tab => tab.name !== "Open Quote");
      }
      lastFetchedId.current = null;
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
      <div className="lg:hidden mb-6 relative" ref={mobileMenuRef}>
        <button
          className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-lg shadow"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span>{filteredTabs[selectedIndex]?.name || "Menu"}</span>
          <Menu className="h-5 w-5" />
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
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
        </AnimatePresence>
      </div>
      {/* 🖥️ Desktop SidebarLayout */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Click-outside overlay to close flyout */}
        {openFlyout && (
          <div className="fixed inset-0 z-40" onClick={() => setOpenFlyout(null)} />
        )}

        <div className={`${isExpanded ? "hidden" : "hidden lg:block"} ${isSidebarCollapsed ? "lg:col-span-1" : "xl:col-span-2 lg:col-span-3"}`}>
          <div className="bg-white rounded-lg shadow-sm p-2">
            {/* Collapse toggle */}
            <button
              onClick={() => { setIsSidebarCollapsed(prev => !prev); setOpenFlyout(null); }}
              className="w-full flex justify-end px-2 py-1.5 mb-1 text-gray-400 hover:text-gray-600 transition"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            {/* <div className="border-t border-gray-100 mb-2" /> */}

            <nav className="space-y-1">
              {filteredTabs.map((tab, index) => (
                <div key={index} className="relative">
                  {isSidebarCollapsed ? (
                    /* ── Icon-only collapsed mode ── */
                    <div className="relative group">
                      <button
                        onClick={() => {
                          if (tab.children) {
                            setOpenFlyout(openFlyout === tab.name ? null : tab.name);
                          } else {
                            handleTabChange(tab.path);
                            setOpenFlyout(null);
                          }
                        }}
                        className={`relative w-full flex items-center justify-center px-2 py-3 rounded-md border-l-2 transition
                          ${pathname.includes(tab.path)
                            ? "bg-blue-50 text-blue-600 border-blue-500"
                            : "text-gray-500 hover:bg-gray-50 border-transparent"}`}
                      >
                        <tab.icon className="h-5 w-5 shrink-0" />
                        {/* Children indicator dot */}
                        {tab.children && (
                          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                      </button>

                      {/* Tooltip — hidden when flyout is open */}
                      {openFlyout !== tab.name && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                          {tab.name}
                          {/* {tab.children && <span className="ml-1 text-gray-400">({tab.children.length})</span>} */}
                        </div>
                      )}

                      {/* Flyout dropdown */}
                      {tab.children && openFlyout === tab.name && (
                        <motion.div
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-full top-0 ml-2 bg-white shadow-xl rounded-lg z-50 min-w-52 py-1 border border-gray-100"
                        >
                          <p className="px-3 pt-2 pb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center gap-2">
                            <tab.icon className="h-3.5 w-3.5" />
                            {tab.name}
                          </p>
                          {tab.children.map((child, childIndex) => (
                            <button
                              key={childIndex}
                              onClick={() => { handleTabChange(child.path); setOpenFlyout(null); }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition
                                ${pathname.includes(child.path)
                                  ? "text-blue-600 bg-blue-50 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"}`}
                            >
                              <span className="text-gray-300">›</span>
                              {child.name}
                              {pathname.includes(child.path) && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    /* ── Full expanded mode ── */
                    <>
                      <button
                        onClick={() => tab.children ? toggleExpand(tab.name) : handleTabChange(tab.path)}
                        className={`w-full flex items-center justify-between text-start px-3 py-2.5 rounded-md text-sm font-medium border-l-2 transition
                          ${pathname.includes(tab.path)
                            ? "bg-blue-50 text-blue-600 border-blue-500"
                            : "text-gray-600 hover:bg-gray-50 border-transparent"}`}
                        title={tab.name}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <tab.icon className="h-4 w-4 shrink-0" />
                          <span className="line-clamp-1">{tab.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* {tab.children && (
                            <span className="text-xs font-normal bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 leading-none">
                              {tab.children.length}
                            </span>
                          )} */}
                          {tab.children && (expanded[tab.name]
                            ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                            : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      {tab.children && expanded[tab.name] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-5 mt-0.5 space-y-0.5 overflow-hidden border-l border-gray-100 pl-3"
                        >
                          {tab.children.map((child, innerIndex) => (
                            <Link
                              key={innerIndex}
                              href={`/dashboard/${child.path}`}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
                                ${pathname.includes(child.path)
                                  ? "text-blue-600 bg-blue-50 font-medium"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
                            >
                              <span className="text-gray-300">›</span>
                              <span className="line-clamp-1">{child.name}</span>
                              {pathname.includes(child.path) && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </>
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
          className={`${isExpanded
            ? "lg:col-span-12"
            : rightSideData
              ? isSidebarCollapsed ? "lg:col-span-9 xl:col-span-9" : "xl:col-span-8 lg:col-span-7 md:col-span-9"
              : isSidebarCollapsed ? "lg:col-span-11 xl:col-span-11" : "xl:col-span-10 lg:col-span-9"
            } overflow-x-auto`}
        >
          <div className="rounded-lg bg-white p-2 md:p-6 shadow-sm w-full relative">
            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="absolute top-3 right-3 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition z-10"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            {children}
          </div>
        </div>
        {rightSideData && !isExpanded && (
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
