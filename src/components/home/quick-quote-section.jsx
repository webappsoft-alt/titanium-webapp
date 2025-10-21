import { FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function QuickQuoteSection() {
  const { push } = useRouter()

  const steps = [
    {
      title: "Material Selection",
      description: "Choose your alloy family, grade, product form, and specifications.",
      image: "/assets/Step 1.jpg",
    },
    {
      title: "Product Configuration",
      description: "Enter dimensions, quantity, and unit of measure. Also add custom cut instructions for cut-to-size items.",
      image: "/assets/Step 2.jpg",
    },
    {
      title: "Generate PDF Quote",
      description: "Get instant pricing as you build your materials list. No commitment required — quick quotes are fast and hassle-free.",
      image: "/assets/Step 3.gif",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Quick Quote: Fast, Easy Metal Sourcing in 3 Steps
          </h2>
          <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
            Easily request pricing for titanium, stainless steel, alloy steel, nickel, cobalt chrome, and other specialty metals.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-full aspect-video mb-6 rounded-lg overflow-hidden bg-white">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-center text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => push("/quick-quote")}
              className="w-full sm:w-auto gap-2"
            >
              Start Your Quote Now
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open("https://titanium.com/rfq", "_blank")}
              className="w-full sm:w-auto gap-2"
            >
              Submit RFQ
              <FileText className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <p className="flex items-center text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              No commitment required - Get your quote instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
