'use client'
import { format } from 'date-fns';
import { FileText, Package, CreditCard } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'quote',
    description: 'Created new quote',
    date: new Date(),
    icon: FileText,
  },
  {
    id: 2,
    type: 'order',
    description: 'Order shipped',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: Package,
  },
  {
    id: 3,
    type: 'payment',
    description: 'Invoice paid',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    icon: CreditCard,
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">Recent Activity</h2>
      <div className="mt-6 flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      <activity.icon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm text-gray-500">
                        {activity.description}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {format(activity.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}