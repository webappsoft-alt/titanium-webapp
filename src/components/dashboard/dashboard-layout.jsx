"use client";
import {
  FileText,
  Users,
  Boxes,
  CreditCard,
  Star,
  Settings2Icon,
  File,
  FileBox,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import SidebarLayout from "./sidebar";

function InvoiceHistory() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Pay Invoice
        </Button>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }) {
  const userData = useSelector((state) => state.auth.userData);
  const isAdmin = userData?.type === "admin";
  const isSales = userData?.type === "sub-admin";

  const userPer = [
    { roles: ["admin"], name: "Overview", icon: Star, path: "overview" },
    {
      roles: ["admin", "regional_manager", "sales_representative"],
      name: "Sales Order",
      icon: FileText,
      path: "sales-order",
    },
    {
      roles: ["admin", "regional_manager", "sales_representative"],
      name: "Open Quotes",
      icon: FileText,
      path: "open-quotes",
    },
    {
      roles: ["admin", "regional_manager", "sales_representative"],
      name: "Close Quotes",
      icon: FileText,
      path: "close-quotes",
    },
    {
      roles: ["admin", "regional_manager", "sales_representative"],
      name: "Customers",
      icon: Users,
      path: "customers",
    },
    {
      roles: ["admin"],
      name: "Reports",
      icon: File,
      children: [
        { name: "Sales Report", path: "sales-report" },
        { name: "Customer Report", path: "customer-report" },
        { name: "Quick Quote Activity Report", path: "quick-quote-report" },
      ],
    },
    { roles: ["admin"], name: "Products", icon: Boxes, path: "products" },
    {
      roles: ["admin"],
      name: "Titanium User",
      icon: Users,
      path: "titanium/user",
    },
    {
      roles: ["admin"],
      name: "Mail Method Setting",
      icon: Settings2Icon,
      path: "mail-setting",
    },
    {
      roles: ["admin"],
      name: "Customer Support",
      icon: Headset,
      path: "support",
    },
    // { roles: ['admin', 'sales_representative'], name: 'Account Settings', icon: Settings, path: 'settings',},
    {
      roles: ["admin"],
      name: "Account Controls",
      icon: Settings2Icon,
      children: [
        { name: "Competitors Domain", path: "competitor" },
        { name: "Competitors Markup", path: "markup" },
        { name: "Payment Methods ", path: "payment-method" },
        { name: "Uploaded File ", path: "file" },
        { name: "Territories", path: "territories" },
        { name: "Countries", path: "countries" },
        { name: "R27 Margin", path: "r27-margin" },
        { name: "States", path: "states" },
        { name: "Tolerance Weight", path: "tolerance-weight" },
        { name: "Category Management", path: "category-management" },
        { name: "Home Section Cards", path: "home-section" },
      ],
    },
    {
      roles: ["admin"],
      name: "Pages",
      icon: FileBox,
      children: [
        { name: "Faqs", path: "faqs" },
        { name: "Terms & Condition", path: "terms-condition" },
        // { name: 'Navigation Menu', path: 'menu', component: MenuForm },
      ],
    },
  ];
  // const tabs = [
  //   ...(isAdmin || isSales ? userPer.filter(item => item.roles?.includes(userData?.permissions || userData.type)) : [
  //     { name: 'Overview', icon: Star, path: 'overview', component: DashboardOverview },
  //     { name: 'Quote History', icon: FileText, path: 'quotes', component: QuoteHistory },
  //     { name: 'Order Tracking', icon: Package, path: 'orders', component: OrderTracking },
  //     { name: 'Saved Items', icon: Star, path: 'saved', component: SavedItems },
  //     { name: 'Invoices', icon: CreditCard, path: 'invoices', component: InvoiceHistory },
  //   ]),
  // ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {userData?.fname} {userData?.lname || ""}
          </p>
        </div>

        {/* {!isAdmin && !isSales && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => navigate('/quick-quote')}
            >
              <FileText className="h-6 w-6 mb-2" />
              New Quote
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => navigate('/dashboard/orders')}
            >
              <Clock className="h-6 w-6 mb-2" />
              Recent Orders
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center"
            >
              <Download className="h-6 w-6 mb-2" />
              Downloads
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => navigate('/dashboard/invoices')}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              Pay Invoice
            </Button>
          </div>
        )} */}

        <SidebarLayout userData={userData} userPer={userPer}>
          {children}
        </SidebarLayout>
      </div>
    </div>
  );
}
