'use client'
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const savedItems = [
  {
    id: 1,
    name: 'Titanium Round Bar',
    category: 'Titanium',
    savedDate: new Date(),
  },
  {
    id: 2,
    name: 'Stainless Steel Plate',
    category: 'Stainless Steel',
    savedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export function SavedItems() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Items</h2>
        <Button variant="ghost" size="sm">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="mt-6">
        <ul className="divide-y divide-gray-200">
          {savedItems.map((item) => (
            <li key={item.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}