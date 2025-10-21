import { useFormContext } from 'react-hook-form';
import { productForms, productFormImages } from './constants';
import { motion } from 'framer-motion';

export function ProductFormSelector() {
  const { register, formState: { errors }, watch } = useFormContext();
  const selectedForm = watch('productForm');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Form
          </label>
          <select
            {...register('productForm', { required: 'Please select a product form' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Product Form</option>
            {productForms.map((form) => (
              <option key={form.value} value={form.value}>{form.label}</option>
            ))}
          </select>
          {errors.productForm && (
            <p className="mt-1 text-sm text-red-600">
              {errors.productForm.message}
            </p>
          )}
        </div>

        {selectedForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center"
          >
            <img
              src={productFormImages[selectedForm]}
              alt={selectedForm}
              className="h-24 w-auto object-contain"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}