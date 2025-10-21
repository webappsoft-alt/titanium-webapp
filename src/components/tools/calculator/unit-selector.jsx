import { useFormContext } from 'react-hook-form';

export function UnitSelector() {
  const { register } = useFormContext();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Unit of Measurement
      </label>
      <select
        {...register('unit')}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="inches">Inches</option>
        <option value="millimeters">Millimeters</option>
      </select>
    </div>
  );
}