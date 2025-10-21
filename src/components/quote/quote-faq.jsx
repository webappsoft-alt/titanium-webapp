import { cn } from '@/lib/utils';

export function QuoteFAQ({ className }) {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
      <h2 className="text-xl font-bold text-gray-900">
        Quick Quote Frequently Asked Questions
      </h2>
      
      <div className="mt-6 space-y-6">
        <div>
          <h3 className="font-medium text-gray-900">How does the Quick Quote process work?</h3>
          <p className="mt-2 text-gray-600">
            Our Quick Quote tool allows you to specify your material requirements and receive 
            instant pricing for standard items. Simply select your material type, enter specifications, 
            and submit your quote request.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">What if I need a custom quote?</h3>
          <p className="mt-2 text-gray-600">
            For custom specifications or special requirements, please use our RFQ submittal form. 
            Our team will review your request and provide a detailed quote within 48 hours.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">What happens after I submit my quote?</h3>
          <p className="mt-2 text-gray-600">
            Once submitted, your quote will be reviewed by our team. We'll verify stock availability 
            and specifications, then send you a formal quote acknowledgment within 48 hours.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">How long are quotes valid?</h3>
          <p className="mt-2 text-gray-600">
            Quote prices are subject to change and are valid at the time of order acknowledgment. 
            Material availability and pricing will be confirmed during the order review process.
          </p>
        </div>
      </div>
    </div>
  );
}
