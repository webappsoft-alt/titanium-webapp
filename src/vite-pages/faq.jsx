import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: "General Questions",
    questions: [
      {
        q: "What is Titanium Industries?",
        a: "Titanium Industries (T.I.) is a global leader in specialty metals supply and processing services. We specialize in titanium, nickel alloys, stainless steel, and other high-performance metals for aerospace, medical, industrial, and other critical applications."
      },
      {
        q: "Where are your locations?",
        a: "T.I. has strategically located service centers throughout North America, Europe, and Asia. Please visit our Locations page for specific details about each facility."
      },
      {
        q: "What certifications does T.I. hold?",
        a: "T.I. maintains AS9100 Rev D, ISO 9001:2015, and numerous customer and industry-specific approvals. Our quality systems meet the most stringent requirements in the industry."
      }
    ]
  },
  // ... other categories remain the same
];

export function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Frequently Asked Questions
              </h1>
            </div>

            <div className="space-y-12">
              {faqs.map((category, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {category.category}
                  </h2>
                  <div className="space-y-6">
                    {category.questions.map((faq, faqIndex) => (
                      <div 
                        key={faqIndex}
                        className="rounded-lg border border-gray-200 p-6 bg-gray-50"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {faq.q}
                        </h3>
                        <p className="text-gray-600">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Still Have Questions?</h2>
              <p className="text-gray-600 mb-6">
                Our team is here to help. Contact us through any of these channels:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:1-888-482-6486" className="text-blue-600 hover:underline">
                    1-888-482-6486
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:sales@titanium.com" className="text-blue-600 hover:underline">
                    sales@titanium.com
                  </a>
                </p>
                <p>
                  <strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}