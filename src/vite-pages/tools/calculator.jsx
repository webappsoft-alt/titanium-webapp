import { WeightCalculator } from '@/components/tools/calculator/weight-calculator';
import { Info } from 'lucide-react';

export function CalculatorPage() {
  return (
    <div className="container py-8 max-sm:px-3">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Metal Weight Calculator</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Please select Product Form, Metal Family, Alloy, and Unit of Measure below.
          Weight will be calculated automatically.
        </p>
      </div>

      {/* Information Box - Separate from calculator */}
      <div className="mb-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-sm border border-blue-200">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 text-lg mb-4">About Weight Calculations</h3>
            <p className="text-blue-800 mb-6 leading-relaxed">
              Our calculator uses industry-standard formulas and material densities to provide accurate weight estimates.
              Theoretical weight per piece is based on nominal dimensions. Actual weight may vary due to dimensional tolerances and variations.
            </p>
            <ul className="text-blue-800 space-y-3 list-disc list-inside">
              <li>All calculations use standard industry densities</li>
              <li>Results are theoretical and may vary slightly from actual weights</li>
              <li>Enable tolerances option for conservative estimates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Calculator Form */}
      <WeightCalculator />
    </div>
  );
}