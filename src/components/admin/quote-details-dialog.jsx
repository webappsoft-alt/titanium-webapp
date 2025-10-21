'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Select, SelectOption } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import ApiFunction from '@/lib/api/apiFuntions';
import toast from 'react-hot-toast';
import { handleError } from '@/lib/api/errorHandler';
import { useState } from 'react';
import { Spinner } from '../ui/spinner';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog';

const quoteUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'closed', 'completed']),
  // pricing: z.object({
  //   subtotal: z.number().min(0),
  //   tax: z.number().min(0),
  //   total: z.number().min(0),
  // }),
  totalAmount: z.number().min(0),
  leadTime: z.string().min(0),
  notes: z.string().optional(),
});

export function QuoteDetailsDialog({ quote, onClose, handleGet }) {
  const { post, put } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(quoteUpdateSchema),
    defaultValues: {
      status: quote?.status,
      totalAmount: quote?.totalAmount,
      // pricing: quote?.pricing || { subtotal: 0, tax: 0, total: 0 },
      leadTime: quote?.leadTime || '',
      notes: quote?.notes || '',
    },
  });
  const onSubmit = async (data) => {
    // In a real app, this would update the quote in the backend
    setIsLoading(true)
    await put(`quotation/status/${quote?._id}`, { status: data?.status, type: data?.type, leadTime: data?.leadTime })
      .then((result) => {
        if (result.success) {
          toast.success(result.message)
          onClose(); handleGet()
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => setIsLoading(false))
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl"  onClose={onClose}>
        <DialogHeader className="flex items-center justify-between mb-6">
          <DialogTitle>Quote Details - {quote?.quoteNo}</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p>Name: {quote?.fname} {quote?.lname}</p>
                <p>Email: {quote?.email}</p>
                <p>Company: {quote?.company}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Quote Status</h3>
              <Select
                {...register('status')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <SelectOption value="pending">Pending Review</SelectOption>
                <SelectOption value="approved">Approved</SelectOption>
                <SelectOption value="rejected">Rejected</SelectOption>
                <SelectOption value="completed">Completed</SelectOption>
                <SelectOption value="closed">Closed Quote</SelectOption>
              </Select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm">Subtotal</Label>
                <Input
                  type="number"
                  disabled
                  {...register('totalAmount', { valueAsNumber: true })}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label className="block text-sm">Tax</Label>
                <Input
                  type="number"
                  disabled
                  {...register('pricing.tax', { valueAsNumber: true })}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label className="block text-sm">Total</Label>
                <Input
                  type="number"
                  disabled
                  {...register('totalAmount', { valueAsNumber: true })}
                  className="mt-1 w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="block font-medium mb-2">Lead Time</Label>
            <Input
              type="text"
              {...register('leadTime')}
              placeholder="e.g., 2-3 weeks"
              className="w-full"
            />
          </div>

          <div>
            <Label className="block font-medium mb-2">Internal Notes</Label>
            <Textarea
              {...register('notes')}
              rows={4}
              disabled
              className="w-full"
            />
          </div>

          <DialogFooter className="flex justify-end gap-4">
            <Button disabled={isLoading} type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? <Spinner /> : 'Update Quote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
