'use client'
import ApiFunction from '@/lib/api/apiFuntions';
import {
  TrendingUp, ShoppingCart, FileText, Clock,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function DashboardStats() {
  const { get } = ApiFunction()
  const [count, setCount] = useState({ openQuote: 0, closeQuote: 0, salesQuote: 0, customers: 0 });
  const stats = [
    {
      name: 'Sales Orders',
      value: count?.salesQuote,
      change: '+2.5%',
      changeType: 'increase',
      icon: FileText,
    },
    {
      name: 'Open Quotes',
      value: count?.openQuote,
      change: '-0.5%',
      changeType: 'decrease',
      icon: ShoppingCart,
    },
    {
      name: 'Close Quotes',
      value: count?.closeQuote,
      change: '+1.2%',
      changeType: 'increase',
      icon: Clock,
    },
    {
      name: 'Customers',
      value: count?.customers,
      change: '+5.4%',
      changeType: 'increase',
      icon: User,
    },
  ];

  const handleGetCount = async () => {
    await get('dashboard/count')
      .then((result) => {
        setCount(result?.count)
      }).catch((err) => {
        console.log(err)
      });
  }
  useEffect(() => {
    handleGetCount()
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative overflow-hidden rounded-lg bg-white p-6 shadow-sm"
        >
          <dt>
            <div className="absolute rounded-md bg-blue-50 p-3">
              <stat.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {stat.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
           {/* <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {stat?.change}
            </p>  */}
          </dd>
        </div>
      ))}
    </div>
  );
}