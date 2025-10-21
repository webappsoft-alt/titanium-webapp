'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShippingStore } from '@/store/shipping-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'; // your custom dialog components

const methodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  baseRate: z.number().min(0, 'Base rate must be 0 or greater'),
  conditions: z.object({
    minWeight: z.number().optional(),
    maxWeight: z.number().optional(),
    minOrder: z.number().optional(),
    maxOrder: z.number().optional(),
  }).optional(),
  restrictions: z.array(z.string()).optional(),
});

export function MethodForm({ zoneId, methodId, onClose }) {
  const { getShippingMethods, addMethod, updateMethod } = useShippingStore();
  const methods = getShippingMethods(zoneId);
  const method = methodId ? methods.find((m) => m.id === methodId) : null;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(methodSchema),
    defaultValues: method || {
      name: '',
      description: '',
      baseRate: 0,
      conditions: {
        minWeight: undefined,
        maxWeight: undefined,
        minOrder: undefined,
        maxOrder: undefined,
      },
      restrictions: [],
    },
  });

  const onSubmit = (data) => {
    if (methodId) {
      updateMethod(zoneId, methodId, data);
    } else {
      addMethod(zoneId, {
        id: `method_${Date.now()}`,
        ...data,
      });
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
        <DialogHeader>
          <DialogTitle>
            {methodId ? 'Edit Shipping Method' : 'Add Shipping Method'}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 absolute top-4 right-4"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Method Name</Label>
            <Input type="text" {...register('name')} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea rows={3} {...register('description')} />
          </div>

          <div>
            <Label>Base Rate ($)</Label>
            <Input type="number" step="0.01" {...register('baseRate', { valueAsNumber: true })} />
            {errors.baseRate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.baseRate.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Weight (lbs)</Label>
              <Input type="number" step="0.1" {...register('conditions.minWeight', { valueAsNumber: true })} />
            </div>

            <div>
              <Label>Max Weight (lbs)</Label>
              <Input type="number" step="0.1" {...register('conditions.maxWeight', { valueAsNumber: true })} />
            </div>

            <div>
              <Label>Min Order ($)</Label>
              <Input type="number" step="0.01" {...register('conditions.minOrder', { valueAsNumber: true })} />
            </div>

            <div>
              <Label>Max Order ($)</Label>
              <Input type="number" step="0.01" {...register('conditions.maxOrder', { valueAsNumber: true })} />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {methodId ? 'Update Method' : 'Add Method'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
