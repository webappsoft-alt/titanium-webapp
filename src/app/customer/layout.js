import CustomerSidebarLayout from "@/components/customer/sidebarLayout";

export default function RootLayout({ children }) {
    return (
        <CustomerSidebarLayout>
            {children}
        </CustomerSidebarLayout>
    );
}
