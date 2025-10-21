import { format } from 'date-fns';
import { Package } from 'lucide-react';

const orders = [
  {
    id: 'ORD-001',
    date: new Date(),
    status: 'In Production',
    items: 2,
    tracking: 'TRK123456789',
  },
  // Add more sample orders as needed
];

export function OrderTracking() {
  return (
    <div className="rounded-lg border bg-white">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Order Tracking</h2>
        <p className="mt-1 text-sm text-gray-600">
          Track the status of your orders
        </p>
      </div>

      <div className="border-t">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border-b p-6 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {order.id}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(order.date, 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {order.status}
              </div>
              <div className="text-sm text-gray-500">
                Tracking: {order.tracking}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}