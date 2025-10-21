'use client'
import { QuickQuoteLayout } from '@/components/quote/quick-quote-layout';
import { SignInPrompt } from '@/components/quote/sign-in-prompt';
import { DiscountedProducts } from '@/components/quote/discounted-products';

export function QuickQuotePage() {

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-4">
          TITANIUM INDUSTRIES | QUICK QUOTE
        </h1>
        <div className="text-gray-600 space-y-2">
          <p>WELCOME TO THE TITANIUM INDUSTRIES QUICK QUOTE APPLICATION</p>
          <p>
            If you were directed here from our specialty metals product page your selection will appear below.
            <br />
            Please continue to build your metal materials quote on this screen.
          </p>
        </div>
      </div>

      {/* Centered Discounted Products Button */}
      <div className="flex justify-center mb-8">
        <DiscountedProducts />
      </div>

      <SignInPrompt />
    </div>
  );
}
