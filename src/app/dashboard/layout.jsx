import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function RootLayout({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}