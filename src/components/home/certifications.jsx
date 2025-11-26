import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
const certifications = [
  {
    name: "Part & Whitney LCS Certified",
    image: "/assets/images/img1.jpg",
    description:
      "Approved by Pratt & Whitney for compliance with their Laboratory Control Specifications (LCS).",
  },
  {
    name: "Defense Logistic Agency",
    image: "/assets/images/img2.webp",
    description:
      "Authorized supplier meeting DLA standards for military and defense logistics.",
  },
  {
    name: "ISO 9001:2015",
    image: "/assets/images/img3.webp",
    description:
      "International standard for quality management systems focused on continual improvement.",
  },
  {
    name: "AS9100",
    image: "/assets/images/img4.webp",
    description:
      "Aerospace industry-specific quality management certification ensuring safety and reliability.",
  },
  {
    name: "NAC International",
    image: "/assets/images/img5.webp",
    description:
      "Certified for compliance with NAC's nuclear materials and security protocols.",
  },
  {
    name: "AS9100 UK, Germany & NJ (US) Location",
    image: "/assets/images/img6.webp",
    description:
      "AS9100 certified across multiple locations, ensuring global aerospace compliance.",
  },
];

export function CertificationsSection({ className }) {
  return (
    <div className={cn("bg-white py-16", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-900">
            Certifications & Quality Approvals
          </h2>
          <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
            Titanium Industries is committed to delivering fully certified
            specialty metals backed by globally recognized quality systems.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="h-24 w-auto flex items-center justify-center">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                {cert.name}
              </h3>
              <p className="mt-2 text-center text-sm text-gray-600">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center flex flex-col items-center gap-3 pt-3">
          <p className="max-w-2xl">Plus a wide range of approvals from most leading OEM's across Aerospace, Medical, Industrial, and Oil and Gas markets.</p>
          <Link href={'https://titanium.com/quality-systems/'} target="_blank">
            <Button>View all Quality Systems</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
