'use client'
import { Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from "next/link";
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import { useState } from 'react';
import SpinnerOverlay from '@/components/ui/spinnerOverlay';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  msg: z.string().min(10, 'Message must be at least 10 characters'),
});

export function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema),
  });
  const { post } = ApiFunction()
  const onSubmit = async (data) => {
    setIsLoading(true)
    await post('support/create', data)
      .then((result) => {
        if (result.success) {
          toast.success(result.message)
          reset();
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => setIsLoading(false))
  };

  return (
    <div className="container py-8">
      {isLoading && <SpinnerOverlay />}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our team of experts is here to help you with your specialty metal needs
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Phone Support</h3>
                <Link href={`tel:1-888-482-6486`} className="text-gray-600">1-888-482-6486</Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <Link href={'mailto:sales@titanium.com'} className="text-gray-600">sales@titanium.com</Link>
              </div>
            </div>

            {/* <div className="flex items-center gap-4">
              <MapPin className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Address</h3>
                 <p className="text-gray-600">
                  18 Green Street, Suite 201
                  <br />
                  Woodbridge, NJ 07095
                </p> 
              </div>
            </div>*/}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Label>
                Name
              </Label>
              <Input
                type="text"
                {...register('name')}

              />
              {errors?.name && (
                <p className="mt-1 text-sm text-red-600">{errors?.name?.message}</p>
              )}
            </div>

            <div>
              <Label>
                Email
              </Label>
              <Input
                type="email"
                {...register('email')}

              />
              {errors?.email && (
                <p className="mt-1 text-sm text-red-600">{errors?.email?.message}</p>
              )}
            </div>

            <div>
              <Label>
                Phone
              </Label>
              <Input
                type="tel"
                {...register('phone')}

              />
              {errors?.phone && (
                <p className="mt-1 text-sm text-red-600">{errors?.phone?.message}</p>
              )}
            </div>

            <div>
              <Label>
                Company (Optional)
              </Label>
              <Input
                type="text"
                {...register('company')}

              />
            </div>

            <div>
              <Label>
                Message
              </Label>
              <Textarea
                {...register('msg')}
                rows={4}

              />
              {errors?.msg && (
                <p className="mt-1 text-sm text-red-600">{errors?.msg?.message}</p>
              )}
            </div>

            <Button type="submit">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}