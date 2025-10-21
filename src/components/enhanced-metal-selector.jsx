import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { metalFamilies, productFormMetalMappings } from '@/constants/metal-mappings';

export function EnhancedMetalSelector() {
  const { register, formState: { errors }, watch, setValue } = useFormContext();
  const selectedProductForm = watch('productForm');
  const selectedMetalFamily = watch('metalType');
  
  // Reset metal family and grade when product form changes
  React.useEffect(() => {
    setValue('metalType', '');
    setValue('grade', '');
  }, [selectedProductForm, setValue]);

  // Reset grade when metal family changes
  React.useEffect(() => {
    setValue('grade', '');
  }, [selectedMetalFamily, setValue]);

  if (!selectedProductForm) return null;

  const availableMetalFamilies = productFormMetalMappings[selectedProductForm] || [];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-2">
          Metal Family
        </label>
        <select
          {...register('metalType', { required: 'Please select a metal family' })}
          className="w-full px-4 py-3 text-base rounded-lg border-2 border-gray-300 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="">Select Metal Family</option>
          {availableMetalFamilies.map((familyName) => (
            <option key={familyName} value={familyName}>
              {familyName}
            </option>
          ))}
        </select>
        {errors.metalType && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.metalType.message}
          </motion.p>
        )}
      </div>

      {selectedMetalFamily && metalFamilies[selectedMetalFamily] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <label className="block text-lg font-semibold text-gray-900 mb-2">
            Grade/Alloy
          </label>
          <select
            {...register('grade', { required: 'Please select a grade' })}
            className="w-full px-4 py-3 text-base rounded-lg border-2 border-gray-300 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select Grade/Alloy</option>
            {metalFamilies[selectedMetalFamily].grades.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {grade.label} ({grade.density} lbs/in³)
              </option>
            ))}
          </select>
          {errors.grade && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.grade.message}
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
}