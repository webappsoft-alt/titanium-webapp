import { useFormContext } from 'react-hook-form';

export function QuantityField() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Quantity
      </label>
      <input
        type="number"
        {...register('quantity', { 
          valueAsNumber: true,
          required: 'Quantity is required',
          min: { value: 1, message: 'Quantity must be at least 1' }
        })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {errors.quantity && (
        <p className="mt-1 text-sm text-red-600">
          {errors.quantity.message}
        </p>
      )}
    </div>
  );
}