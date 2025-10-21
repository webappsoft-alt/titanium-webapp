import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShippingStore } from '@/store/shipping-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectOption } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle 
} from '@/components/ui/dialog'; // Update this path to where you've placed the Dialog component

const zoneSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  countries: z.array(z.string()).min(1, 'At least one country is required'),
  regions: z.array(z.string()).optional(),
});

export function ZoneForm({ zoneId, onClose }) {
  const { zones, addZone, updateZone } = useShippingStore();
  const zone = zoneId ? zones.find((z) => z.id === zoneId) : null;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(zoneSchema),
    defaultValues: zone || {
      name: '',
      countries: [],
      regions: [],
    },
  });

  const onSubmit = (data) => {
    if (zoneId) {
      updateZone(zoneId, data);
    } else {
      addZone({
        id: `zone_${Date.now()}`,
        ...data,
        methods: [],
      });
    }
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl" onClose={onClose} closeButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {zoneId ? 'Edit Shipping Zone' : 'Add Shipping Zone'}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>
              Zone Name
            </Label>
            <Input
              type="text"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label>
              Countries
            </Label>
            <Select
              multiple
              {...register('countries')}
            >
              <SelectOption value="US">United States</SelectOption>
              <SelectOption value="CA">Canada</SelectOption>
              <SelectOption value="MX">Mexico</SelectOption>
            </Select>
            {errors.countries && (
              <p className="mt-1 text-sm text-red-600">
                {errors.countries.message}
              </p>
            )}
          </div>

          <div>
            <Label>
              Regions (Optional)
            </Label>
            <Select
              multiple
              {...register('regions')}
            >
              <SelectOption value="WEST">West</SelectOption>
              <SelectOption value="EAST">East</SelectOption>
              <SelectOption value="CENTRAL">Central</SelectOption>
            </Select>
          </div>

          <DialogFooter>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {zoneId ? 'Update Zone' : 'Add Zone'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}