import { Calculator, Book, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ToolsSection() {
  const { push } = useRouter()

  const tools = [
    {
      icon: Calculator,
      name: "Metal Weight Calculator",
      description: "Quickly estimate the weight of titanium, stainless steel, nickel, alloy steel, and other bar, sheet, and plate products by entering dimensions and material type.",
      path: "/tools/calculator",
    },
    {
      icon: Book,
      name: "Technical Reference Library",
      description: "Find mechanical properties, tolerances, and specification sheets for all stocked alloys, including titanium round bar, stainless steel bar stock, and nickel alloys.",
      path: "/tools/references",
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-900">
          Tools & Technical Resources
        </h2>
        <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
          Access helpful tools and product data to support your specialty metal sourcing and engineering decisions.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="relative rounded-lg border bg-white p-2 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="flex min-h-12 max-h-12 max-w-12 min-w-12 items-center justify-center rounded-lg bg-blue-50">
                  <tool.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{tool.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {tool.description}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="mt-4 w-full justify-between"
                onClick={() => push(tool.path)}
              >
                Try Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
