import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Select, SelectOption } from "../ui/select";
import { AuthDialog } from "../auth/auth-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignInPrompt() {
  const { push } = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-8">
      {/* Sign In Required Message */}
      <div className="text-center">
        <p className="text-xl font-bold text-red-600 mb-8">
          Sign in / Approval Required to Access Quick Quote Tool
        </p>
      </div>
      {/* Sign In Button */}
      <div className="flex justify-center gap-3">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          className="px-4 whitespace-nowrap"
        >
          Sign in to Continue
        </Button>{" "}
        <span className="text-2xl"> / </span>
        <Button
          onClick={() => push("/auth/register")}
          size="sm"
          variant="secondary"
          className="px-4 whitespace-nowrap"
        >
          Sign up
        </Button>
      </div>
      <AuthDialog isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
      {/* Material Selection Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Material Selection</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>METAL TYPE</Label>
            <Select disabled>
              <SelectOption>Sign in required</SelectOption>
            </Select>
          </div>

          <div>
            <Label>PRODUCT FORM</Label>
            <Select disabled>
              <SelectOption>Sign in required</SelectOption>
            </Select>
          </div>

          <div>
            <Label>GRADE/ALLOY</Label>
            <Select disabled>
              <SelectOption>Sign in required</SelectOption>
            </Select>
          </div>

          <div>
            <Label>SPECIFICATIONS</Label>
            <Select disabled>
              <SelectOption>Sign in required</SelectOption>
            </Select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            Please select Metal Type, Product Form, Grade/Alloy, and
            Specifications.
          </p>
          <p>Once completed, please proceed to Product Configuration.</p>
        </div>
      </div>

      {/* Product Configuration Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Product Configuration</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>PRIMARY DIMENSION</Label>
            <Select disabled>
              <SelectOption>Sign in required</SelectOption>
            </Select>
          </div>

          <div>
            <Label>QUANTITY</Label>
            <Select disabled>
              <SelectOption>Sign in required</SelectOption>
            </Select>
          </div>

          <div>
            <Label>UOM</Label>
            <Select disabled>
              <SelectOption>lbs</SelectOption>
            </Select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            Material Selection must be completed to access Product
            Configuration.
          </p>
          <p>
            Not seeing the product you're looking for? Use our{" "}
            <a
              href="https://titanium.com/rfq"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFQ submittal form
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-sm text-gray-600">
          Prices at time of order acknowledgement apply and are subject to
          change. Titanium Industries reserves the right to make any corrections
          to prices quoted due to new information, errors, or any other
          significant changes. All orders are subject to a full contract review
          of all specifications and a 48-hour order approval process to verify
          all details, stock availability, and terms and conditions. All orders
          will be acknowledged by a T.I. salesperson.
        </p>
      </div>
    </div>
  );
}
