import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { QuoteProgress } from './quote-progress';
import { EnhancedMetalSelector } from './enhanced-metal-selector';
import { ProductFormSelector } from './product-form-selector';
import { DimensionFields } from './dimension-fields';
import { QuantityField } from './quantity-field';
import { QuoteSummary } from './quote-summary';
import { useQuoteStore } from '@/store/quote-store';

const quoteSchema = z.object({
  metalType: z.string().min(1, 'Please select a metal type'),
  productForm: z.string().min(1, 'Please select a product form'),
  grade: z.string().min(1, 'Please select a grade'),
  dimensions: z.record(z.number().min(0, 'Dimension must be greater than 0')),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional()
});

export function QuoteForm({ onStepChange }) {
  const { addItem } = useQuoteStore();
  const methods = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      metalType: '',
      productForm: '',
      grade: '',
      dimensions: {},
      quantity: 1,
      notes: ''
    }
  });

  const onSubmit = (data) => {
    addItem({
      productId: `${data.metalType}-${data.productForm}`,
      quantity: data.quantity,
      specifications: {
        grade: data.grade,
        dimensions: Object.entries(data.dimensions).map(([key, value]) => ({
          name: key,
          value,
          unit: 'inches'
        }))
      },
      notes: data.notes
    });
    
    methods.reset();
    onStepChange(3);
  };

  const currentStep = methods.watch('metalType') && methods.watch('productForm') ? 2 : 1;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {/* Progress Indicator */}
        <QuoteProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-6">Material Selection</h2>
              <div className="space-y-6">
                <EnhancedMetalSelector />
                <ProductFormSelector />
              </div>
            </motion.div>

            {methods.watch('metalType') && methods.watch('productForm') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-6">Product Configuration</h2>
                <div className="space-y-6">
                  <DimensionFields />
                  <QuantityField />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      {...methods.register('notes')}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            {methods.watch('metalType') && methods.watch('productForm') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <Button
                  type="submit"
                  size="lg"
                  className="min-w-[200px]"
                >
                  Add to Quote
                </Button>
              </motion.div>
            )}
          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <QuoteSummary />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}