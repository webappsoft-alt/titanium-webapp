import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/product-store';
import { processCSVFile } from '@/lib/utils/csv';

const REQUIRED_COLUMNS = ['name', 'category', 'price', 'quantity'];
const OPTIONAL_COLUMNS = ['id', 'type', 'form', 'grade', 'dimensions', 'description'];

export function CSVImport() {
  const { addProducts } = useProductStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      toast.error('Please select a valid CSV file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsProcessing(true);
    try {
      const products = await processCSVFile(file);
      addProducts(products);
      toast.success(`Successfully imported ${products.length} products`);
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error(error.message || 'Failed to process CSV file');
    } finally {
      setIsProcessing(false);
    }
  }, [addProducts]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isProcessing
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          CSV Format Requirements
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Required Columns:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
              {REQUIRED_COLUMNS.map(col => (
                <li key={col}>{col}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Optional Columns:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
              {OPTIONAL_COLUMNS.map(col => (
                <li key={col}>{col}</li>
              ))}
            </ul>
          </div>
          <div className="text-sm text-gray-500">
            <p>Example CSV format:</p>
            <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
              name,category,price,quantity,grade,dimensions{'\n'}
              "Titanium Bar","Titanium",299.99,100,"Grade 5",12{'\n'}
              "Steel Plate","Steel",199.99,50,"304",24
            </pre>
          </div>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
        `}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
        ) : (
          <Upload className={`mx-auto h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        )}
        <p className="mt-2 text-sm font-medium text-gray-900">
          {isProcessing ? 'Processing file...' : 
           isDragActive ? 'Drop the CSV file here' : 
           'Drag and drop a CSV file, or click to select'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Only .csv files are supported (max 5MB)
        </p>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">CSV File Requirements:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>File must be in CSV format with comma separators</li>
              <li>First row must contain column headers</li>
              <li>Text values can be optionally quoted</li>
              <li>Numbers should not contain currency symbols</li>
              <li>All required columns must have values</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}