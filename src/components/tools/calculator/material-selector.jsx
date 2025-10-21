import React from 'react';
import { useFormContext } from 'react-hook-form';
import { materials, productForms } from './constants';
import { motion } from 'framer-motion';
import { Select, SelectOption } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function MaterialSelector() {
  const { register, formState: { errors }, watch, setValue } = useFormContext();
  const selectedProductForm = watch('productForm');
  const selectedMaterial = watch('material');

  // Get available materials for the selected product form
  const availableMaterials = productForms.find(
    form => form.value === selectedProductForm
  )?.materials || [];

  // Reset material and grade when product form changes
  React.useEffect(() => {
    setValue('material', '');
    setValue('grade', '');
  }, [selectedProductForm, setValue]);

  // Reset grade when material changes
  React.useEffect(() => {
    setValue('grade', '');
  }, [selectedMaterial, setValue]);

  if (!selectedProductForm) return null;

  return (
    <div className="space-y-4">
      <div>
        <Label>
          Metal Family
        </Label>
        <Select
          {...register('material')}
          
        >
          <SelectOption value="">Select Metal Family</SelectOption>
          {availableMaterials.map((material) => (
            <SelectOption key={material} value={material}>
              {material}
            </SelectOption>
          ))}
        </Select>
        {errors.material && (
          <p className="mt-1 text-sm text-red-600">
            {errors.material.message}
          </p>
        )}
      </div>

      {selectedMaterial && (
        <div>
          <Label>
            Grade/Alloy
          </Label>
          <Select
            {...register('grade')}
            
          >
            <SelectOption value="">Select Grade/Alloy</SelectOption>
            {materials[selectedMaterial]?.grades.map((grade) => (
              <SelectOption key={grade.value} value={grade.value}>
                {grade.label}
              </SelectOption>
            ))}
          </Select>
          {errors.grade && (
            <p className="mt-1 text-sm text-red-600">
              {errors.grade.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}