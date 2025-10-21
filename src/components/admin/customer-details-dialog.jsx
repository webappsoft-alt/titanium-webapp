'use client'
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle 
} from '@/components/ui/dialog'; // Update this path to where you've placed the Dialog component

export function CustomerDetailsDialog({ customer, onClose }) {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl" onClose={onClose} closeButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Customer Details
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Basic Information</h3>
              <div className="space-y-1 text-sm">
                <p>Name: {customer.name}</p>
                <p>Email: {customer.email}</p>
                <p>Company: {customer.company || '-'}</p>
                <p>Customer Since: {format(new Date(), 'MMM d, yyyy')}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Quote Statistics</h3>
              <div className="space-y-1 text-sm">
                <p>Total Quotes: {customer.totalQuotes}</p>
                <p>Active Quotes: {customer.activeQuotes || 0}</p>
                <p>Approved Quotes: {customer.approvedQuotes || 0}</p>
                <p>Last Quote: {format(customer.lastQuote, 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Recent Activity</h3>
            <div className="space-y-2">
              {/* Add recent activity list here */}
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}