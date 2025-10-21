'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'; // Adjust this path if needed

export function CustomerSupportDetailsDialog({ customer, onClose }) {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p>
                <span className="font-bold">Name:</span> {customer?.name}
              </p>
              <p>
                <span className="font-bold">Email:</span> {customer?.email}
              </p>
              <p>
                <span className="font-bold">Company:</span>{' '}
                {customer?.company || '-'}
              </p>
              <p>
                <span className="font-bold">Created At:</span>{' '}
                {format(new Date(), 'MMM d, yyyy')}
              </p>
              <p>
                <span className="font-bold">Status:</span>{' '}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    customer?.attended
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {customer?.attended ? 'Attended' : 'Not Attended'}
                </span>
              </p>
              <p>
                <span className="font-bold">Message:</span>{' '}
                {customer?.msg || '-'}
              </p>
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
