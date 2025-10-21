import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { SavedItems } from "@/components/dashboard/saved-items"

const Page = () => {
    return (
        <>
            <div className="space-y-6">
                <DashboardStats />
                <div className="grid lg:grid-cols-2 gap-6">
                    <RecentActivity />
                    <SavedItems />
                </div>
            </div>
        </>
    )
}

export default Page