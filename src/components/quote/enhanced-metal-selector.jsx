import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Select } from '../ui/select';
import { FormFeedback } from '../ui/formFeedBack';

const metalTypes = [
  { value: 'titanium', label: 'Titanium' },
  { value: 'stainless-steel', label: 'Stainless Steel' },
  { value: 'nickel-alloy', label: 'Nickel Alloy' },
  { value: 'aluminum', label: 'Aluminum' }
];

const grades = {
  titanium: [
    { value: 'grade-2', label: 'Grade 2' },
    { value: 'grade-5', label: 'Grade 5 (Ti-6Al-4V)' },
    { value: 'grade-7', label: 'Grade 7' }
  ],
  'stainless-steel': [
    { value: '304', label: '304' },
    { value: '316', label: '316L' },
    { value: '321', label: '321' }
  ],
  'nickel-alloy': [
    { value: '625', label: 'Alloy 625' },
    { value: '718', label: 'Alloy 718' }
  ],
  'aluminum': [
    { value: '6061', label: '6061-T6' },
    { value: '7075', label: '7075-T6' }
  ]
};

export function EnhancedMetalSelector() {
  const { register, formState: { errors }, watch } = useFormContext();
  const selectedMetal = watch('metalType');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Metal Type
        </label>
        <Select
          {...register('metalType')}
        >
          <option value="">Select Metal Type</option>
          {metalTypes.map((metal) => (
            <option key={metal.value} value={metal.value}>
              {metal.label}
            </option>
          ))}
        </Select>
        {errors.metalType && (
          <FormFeedback>
            {errors.metalType.message}
          </FormFeedback>
        )}
      </div>

      {selectedMetal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-gray-700">
            Grade/Alloy
          </label>
          <Select
            {...register('grade')}
          >
            <option value="">Select Grade</option>
            {grades[selectedMetal]?.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </Select>
          {errors.grade && (
            <FormFeedback>
              {errors.grade.message}
            </FormFeedback>
          )}
        </motion.div>
      )}
    </div>
  );
}