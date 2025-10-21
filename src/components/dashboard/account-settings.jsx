import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const accountSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  address: z.string().min(5),
  phone: z.string().min(10),
});

export function AccountSettings() {
  const { user, updateUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      company: user?.company,
    },
  });

  const onSubmit = (data) => {
    updateUser(data);
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">Account Settings</h2>
      <p className="mt-1 text-sm text-gray-600">
        Update your account information
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label >
              Name
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
            <Label >
              Email
            </Label>
            <Input
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label >
              Company
            </Label>
            <Input
              type="text"
              {...register('company')}
            />
          </div>

          <div>
            <Label >
              Phone
            </Label>
            <Input
              type="tel"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label >
              Address
            </Label>
            <Textarea
              {...register('address')}
              rows={3}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
