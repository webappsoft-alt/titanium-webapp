import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function ContactSection() {
  const faqs = [

  ]
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-900">
              Contact Titanium Industries
            </h2>
            <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
              Our team of specialty metal experts is here to help you source titanium, stainless steel, alloy steel, nickel, cobalt chrome, and more.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Phone Support</h3>
                  <a href="tel:1-888-482-6486" className="text-gray-600 text-sm md:text-base lg:text-lg">
                    1-888-482-6486
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a href="mailto:sales@titanium.com" className="text-gray-600 text-sm md:text-base lg:text-lg">
                    sales@titanium.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-sm md:text-base lg:text-lg">
                    Address
                  </h3>
                  <a href="https://titanium.com/titanium-industries-global-metal-supplier-locations/" target="_blank" className="text-gray-600">
                    Global Locations
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 lg:p-8">
            <form className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input type="text" placeholder={'Enter Your Full Name'} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder={'Enter Your Email'} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" placeholder={'Enter Your Phone'} />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea rows={4} placeholder={'Write Message'} />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
        <div className="space-y-3 mt-3">
          {[
            { q: 'Need a quote or have technical questions?', a: 'We support inquiries for titanium round bar, stainless steel bar stock, custom-cut plate, pipe fittings, and all stocked alloys. Reach out to speak with a knowledgeable team member today.' },
            { q: 'Prefer to message us?', a: 'Use the form below to tell us what you need. A representative will respond promptly.' }
          ].map((faq, faqIndex) => (
            <div
              key={faqIndex}
              className="rounded-lg border border-gray-200 p-3 bg-gray-50"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {faq.q}
              </h2>
              <p className="text-gray-600 text-sm">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
