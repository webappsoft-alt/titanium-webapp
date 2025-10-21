import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function ValidationSummary({ results }) {
  const { valid, errors = [], warnings = [], count } = results;

  return (
    <div className="space-y-4">
      <div className={`rounded-lg p-4 ${
        valid ? 'bg-green-50' : 'bg-red-50'
      }`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {valid ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400" />
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${
              valid ? 'text-green-800' : 'text-red-800'
            }`}>
              {valid
                ? `Validation Passed - ${count} products ready to import`
                : 'Validation Failed - Please correct the following errors'}
            </h3>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-white p-4">
          <h4 className="text-sm font-medium text-red-800">Errors</h4>
          <div className="mt-2 space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="text-sm text-red-700">
                Row {error.row}: {error.field} - {error.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-white p-4">
          <h4 className="text-sm font-medium text-yellow-800">Warnings</h4>
          <div className="mt-2 space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="text-sm text-yellow-700">
                Row {warning.row}: {warning.field} - {warning.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}