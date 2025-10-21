import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from '../ui/label';
import { Select, SelectOption } from '../ui/select';

const productForms = [
  { value: 'round-bar', label: 'Round Bar' },
  { value: 'plate', label: 'Plate' },
  { value: 'sheet', label: 'Sheet' },
  { value: 'pipe', label: 'Pipe' },
  { value: 'tube', label: 'Tube' },
  { value: 'block', label: 'Block' }
];

export function ProductFormSelector() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <Label>
        Product Form
      </Label>
      <Select
        {...register('productForm')}
      >
        <SelectOption value="">Select Product Form</SelectOption>
        {productForms.map((form) => (
          <SelectOption key={form.value} value={form.value}>
            {form.label}
          </SelectOption>
        ))}
      </Select>
      {errors.productForm && (
        <p className="mt-1 text-sm text-red-600">
          {errors.productForm.message}
        </p>
      )}
    </div>
  );
}