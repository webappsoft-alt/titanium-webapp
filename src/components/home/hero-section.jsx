import { FileText, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function HeroSection() {
  const { push } = useRouter()

  return (
    <div className="relative isolate">
      {/* New banner with reduced height */}
      <div className="absolute inset-0 -z-10 sm:h-[464px] max-sm:min-h-[442px]">
        <img
          src="https://titanium.com/wp-content/uploads/2024/11/Revised-QQA-Re-design-Draft-2.png"
          alt="Titanium Industries"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/70" />
      </div>

      {/* Centered content with consistent spacing */}
      <div className="relative mx-auto max-w-7xl md:px-6 px-2 py-11">
        <div className="mx-auto max-w-3xl text-center ">
          <div className="">
            <Image src={'/logo-white.png'} width={200} height={100} alt="" className="mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-6xl mb-6 ">
            Global Specialty
            <br />
            <span className="text-blue-400 pt-2">Metals Distributor</span>
          </h1>
          <h2 className="text-lg leading-6 text-gray-300 mb-10 mx-auto ">
            Titanium Industries is a global leader in specialty metals and titanium supply for the Aerospace, Defense, Industrial, Medical, and Oil & Gas markets. With the world's most comprehensive inventory—including Titanium Round Bar, Rectangle Bar, Plate, Sheet, Pipe, Fittings, and a wide range of specialty metals—T.I. supports customers through a global network of service centers. Since 1972, our technically driven team has delivered dependable, quality-focused supply solutions for projects of all sizes and complexities.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={() => push("/quick-quote")}
            >
              Get a Quick Quote
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              className="gap-2 bg-white text-gray-900 hover:bg-gray-100 px-8"
              onClick={() => push("/product")}
            >
              <Boxes className="h-4 w-4" />
              Browse Products
            </Button>
          </div>
        </div>
      </div>

      {/* Metallic texture background for content sections */}
      {/* <div className="absolute inset-0 -z-20">
        <div className="h-full w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-10 mix-blend-overlay" />
      </div> */}
    </div>
  );
}
