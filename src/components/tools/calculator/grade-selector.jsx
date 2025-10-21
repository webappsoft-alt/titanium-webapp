import { useFormContext, useWatch } from 'react-hook-form';

const grades = {
  titanium: [
    { value: 'grade-2', label: 'Grade 2' },
    { value: 'grade-5', label: 'Grade 5 (Ti-6Al-4V)' },
    { value: 'grade-7', label: 'Grade 7' },
  ],
  'stainless-steel': [
    { value: '304', label: '304' },
    { value: '316', label: '316L' },
    { value: '321', label: '321' },
  ],
  'nickel-alloy': [
    { value: 'inconel-625', label: 'Inconel 625' },
    { value: 'inconel-718', label: 'Inconel 718' },
    { value: 'monel-400', label: 'Monel 400' },
  ],
  'aluminum': [
    { value: '6061', label: '6061-T6' },
    { value: '7075', label: '7075-T6' },
    { value: '5052', label: '5052-H32' },
  ],
};

export function GradeSelector() {
  const { register, formState: { errors } } = useFormContext();
  const metalType = useWatch({ name: 'metalType' });

  if (!metalType) return null;

  const availableGrades = grades[metalType] || [];

  return (
    <div>
      <select
        {...register('grade')}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        disabled={!metalType}
      >
        <option value="">Select Grade/Alloy</option>
        {availableGrades.map((grade) => (
          <option key={grade.value} value={grade.value}>
            {grade.label}
          </option>
        ))}
      </select>
      {errors.grade && (
        <p className="mt-1 text-sm text-red-600">
          {errors.grade.message}
        </p>
      )}
    </div>
  );
}