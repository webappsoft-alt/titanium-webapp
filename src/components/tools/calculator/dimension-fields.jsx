import { useFormContext } from 'react-hook-form';
import { productForms } from './constants';
import { motion } from 'framer-motion';

export function DimensionFields() {
  const { register, formState: { errors }, watch } = useFormContext();
  const productForm = watch('productForm');
  const selectedForm = productForms.find(form => form.value === productForm);

  if (!selectedForm) return null;

  const getDimensionLabel = (dimension) => {
    const labels = {
      'diameter': 'Diameter',
      'length': 'Length',
      'width': 'Width',
      'height': 'Height',
      'thickness': 'Thickness',
      'outer-diameter': 'Outer Diameter',
      'wall-thickness': 'Wall Thickness',
      'across-flats': 'Across Flats'
    };
    return labels[dimension] || dimension;
  };

  return (
    <div className="space-y-4">
      {selectedForm.dimensions.map((dimension) => (
        <motion.div
          key={dimension}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-gray-700">
            {getDimensionLabel(dimension)} (inches)
          </label>
          <input
            type="number"
            step="0.001"
            {...register(`dimensions.${dimension}`, { 
              valueAsNumber: true,
              required: `${getDimensionLabel(dimension)} is required`,
              min: { value: 0.001, message: `${getDimensionLabel(dimension)} must be greater than 0` }
            })}
            className="w-full px-4 py-3 text-base rounded-lg border-2 border-gray-300 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.dimensions?.[dimension] && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 font-medium"
            >
              {errors.dimensions[dimension].message}
            </motion.p>
          )}
        </motion.div>
      ))}
    </div>
  );
}