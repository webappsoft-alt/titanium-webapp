import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuoteProgress({ currentStep }) {
  const steps = [
    {
      number: 1,
      title: 'Metal Type',
      description: 'Select metal family',
    },
    {
      number: 2,
      title: 'Product Form',
      description: 'Choose specifications',
    },
    {
      number: 3,
      title: 'Review',
      description: 'Submit quote',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className={cn(
              'flex-1 relative',
              step.number !== steps.length && 'mb-4 md:mb-0'
            )}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold',
                  currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : currentStep === step.number
                    ? 'bg-[#007BFF] text-white'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold text-[#333333]">
                  {step.title}
                </p>
                <p className="text-sm text-gray-500">
                  {step.description}
                </p>
              </div>
            </div>
            {step.number !== steps.length && (
              <div
                className={cn(
                  'hidden md:block absolute top-5 -right-1/2 w-full border-t-2',
                  currentStep > step.number
                    ? 'border-green-500'
                    : 'border-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}