import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const dimensionFields = {
  'round-bar': [
    { name: 'diameter', label: 'Diameter (inches)' },
    { name: 'length', label: 'Length (inches)' }
  ],
  'plate': [
    { name: 'thickness', label: 'Thickness (inches)' },
    { name: 'width', label: 'Width (inches)' },
    { name: 'length', label: 'Length (inches)' }
  ],
  'sheet': [
    { name: 'thickness', label: 'Thickness (inches)' },
    { name: 'width', label: 'Width (inches)' },
    { name: 'length', label: 'Length (inches)' }
  ],
  'pipe': [
    { name: 'diameter', label: 'Diameter (inches)' },
    { name: 'wall', label: 'Wall Thickness (inches)' },
    { name: 'length', label: 'Length (inches)' }
  ],
  'tube': [
    { name: 'diameter', label: 'Diameter (inches)' },
    { name: 'wall', label: 'Wall Thickness (inches)' },
    { name: 'length', label: 'Length (inches)' }
  ],
  'block': [
    { name: 'width', label: 'Width (inches)' },
    { name: 'height', label: 'Height (inches)' },
    { name: 'length', label: 'Length (inches)' }
  ]
};

export function DimensionFields() {
  const { register, formState: { errors }, watch } = useFormContext();
  const productForm = watch('productForm');

  if (!productForm) return null;

  const fields = dimensionFields[productForm] || [];

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Label>
            {field.label}
          </Label>
          <Input
            type="number"
            step="0.001"
            {...register(`dimensions.${field.name}`, { valueAsNumber: true })}
           
          />
          {errors.dimensions?.[field.name] && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dimensions[field.name].message}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}