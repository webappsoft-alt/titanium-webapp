'use client'
import Link from "next/link";
import { Button } from "../ui/button";
import { QuoteForm } from "./quote-form";
import "@/styles/quick-quote.css";

export function QuickQuoteLayout() {
  return (
    <div className="flex-1 bg-white">
      <div className=" mx-auto px-3 md:px-8 py-6 min-[2000px]:px-0">
        {/* Logo Banner */}
        <div className="mb-12 mt-4 text-center">
          <h1 className="text-2xl mb-4 font-medium">
            TITANIUM INDUSTRIES | QUICK QUOTE
          </h1>
          <h6 className="font-medium">
            WELCOME TO THE TITANIUM INDUSTRIES QUICK QUOTE APPLICATION
          </h6>
          <p className="mb-0 text-sm">
            {" "}
            If you were directed here from our specialty metals product page
            your selection will appear below.
          </p>
          <p className="mb-4 text-sm text-muted">
            Please continue to build your metal materials quote on this screen.
          </p>
          <img
            src="/assets/qq-logo.png"
            alt="Titanium Industries Quick Quote"
            className="w-full pt-3"
          />
          <div className="mt-2 flex justify-center">
            {" "}
            <Link href={"/customer/discounted-products"}>
              {" "}
              <Button
                variant="main"
                className="bg-[#0a1f3c] text-white shadow hover:bg-slate-900/90"
              >
                Discounted Products
              </Button>
            </Link>{" "}
          </div>
        </div>
        <QuoteForm />
      </div>
    </div>
  );
}
