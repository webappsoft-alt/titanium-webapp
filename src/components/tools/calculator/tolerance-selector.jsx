import { useFormContext } from 'react-hook-form';
import { tolerances } from './constants';
import { motion } from 'framer-motion';

export function ToleranceSelector() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Tolerance
      </label>
      <select
        {...register('tolerance')}
        className="w-full px-4 py-3 text-base rounded-lg border-2 border-gray-300 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <option value="">Select Tolerance</option>
        {tolerances.map((tolerance) => (
          <option key={tolerance.value} value={tolerance.value}>
            {tolerance.label}
          </option>
        ))}
      </select>
      {errors.tolerance && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 font-medium"
        >
          {errors.tolerance.message}
        </motion.p>
      )}
    </div>
  );
}