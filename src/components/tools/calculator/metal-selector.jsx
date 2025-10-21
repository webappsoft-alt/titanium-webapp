import { useFormContext } from 'react-hook-form';

export const metalTypes = [
  { value: 'titanium', label: 'Titanium', density: 0.163 },
  { value: 'stainless-steel', label: 'Stainless Steel', density: 0.284 },
  { value: 'nickel-alloy', label: 'Nickel Alloy', density: 0.308 },
  { value: 'alloy-steel', label: 'Alloy Steel', density: 0.284 },
  { value: 'carbon-steel', label: 'Carbon Steel', density: 0.284 },
  { value: 'cobalt-chrome', label: 'Cobalt Chrome Moly', density: 0.318 },
  { value: 'aluminum', label: 'Aluminum', density: 0.098 },
];

export function MetalSelector() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Metal Family
      </label>
      <select
        {...register('metalType')}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select Metal Type</option>
        {metalTypes.map((metal) => (
          <option key={metal.value} value={metal.value}>
            {metal.label}
          </option>
        ))}
      </select>
      {errors.metalType && (
        <p className="mt-1 text-sm text-red-600">
          {errors.metalType.message}
        </p>
      )}
    </div>
  );
}