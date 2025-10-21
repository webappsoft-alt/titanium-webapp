import { useState } from 'react';
import { UNITS, DIMENSION_TOLERANCES } from './constants';

export function DimensionInput({
  label,
  dimension,
  productForm,
  value,
  onChange,
  withTolerances,
  unit,
  onUnitChange
}) {
  const tolerance = DIMENSION_TOLERANCES[productForm]?.[dimension];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {withTolerances && tolerance && (
          <span className="ml-2 text-sm text-gray-500">
            (± {tolerance.value} {tolerance.unit})
          </span>
        )}
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step="0.001"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {UNITS.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}