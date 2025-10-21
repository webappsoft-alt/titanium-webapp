import { useState } from 'react';
import { FileSpreadsheet, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ProductImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('Please select a valid file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-blue-500" />
          Import Products
        </h2>
        
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Supported File Types:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>CSV files (.csv)</li>
              <li>Excel files (.xlsx, .xls)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Required Fields:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Name</li>
              <li>Category</li>
              <li>Price</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Optional Fields:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>SKU, Description, Type, Form</li>
              <li>Grades, Dimensions, Units</li>
              <li>Quantity, Location</li>
              <li>Volume Pricing, Shipping Details</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
        `}
      >
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        {isProcessing ? (
          <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
        ) : (
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
        )}
        <p className="mt-2 text-sm font-medium text-gray-900">
          {isProcessing ? 'Processing file...' : 'Click to select a file'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: CSV, Excel (max 10MB)
        </p>
      </div>

      {validationResults && (
        <div className="rounded-lg border bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Validation Results</h3>
              <p className="mt-1 text-sm text-blue-700">
                Found {validationResults.count} valid products ready for import.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}