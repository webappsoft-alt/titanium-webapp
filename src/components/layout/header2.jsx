import {
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

export function Header2() {


  return (
    <header className="sticky top-0 z-40 w-full bg-[#032a68] backdrop-blur-xl shadow-lg">
      <div className="container">
        {/* Top Bar */}
        <div className="flex py-[8px] items-center gap-3">
          <Link href="https://titanium.com/">
            <img
              src="/titanium_LOGO.webp"
              alt="Titanium Industries"
              className="h-[50px] w-auto me-2"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <a
              href="mailto:sales@titanium.com"
              className="flex items-center text-sm text-white/90 hover:text-blue-600"
            >
              <Mail className="h-4 w-4 mr-1" />
              sales@titanium.com
            </a>
            <a
              href="tel:1-888-482-6486"
              className="flex items-center text-sm text-white/90 hover:text-blue-600"
            >
              <Phone className="h-4 w-4 mr-1" />
              1-888-482-6486
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
