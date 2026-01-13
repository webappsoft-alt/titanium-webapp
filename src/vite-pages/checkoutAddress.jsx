"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/formFeedBack";
import { Select, SelectOption } from "@/components/ui/select";
import PhoneInput from "react-phone-number-input";
import ApiFunction from "@/lib/api/apiFuntions";
import { useDispatch, useSelector } from "react-redux";
import { handleError } from "@/lib/api/errorHandler";
import { CheckBox } from "@/components/ui/checkbox";
import { RadioButton } from "@/components/ui/radioButton";
import { setCheckoutData } from "@/lib/redux/checkout";

// Validation schema for address fields
const addressFieldsSchema = z.object({
  fname: z.string().min(1, { message: "First name is required" }),
  lname: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address1: z.string().min(1, { message: "Address is required" }),
  address2: z.string().optional(),
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "Country is required" }),
  zipCode: z.string().optional(),
});

// Combined schema for the entire form
const addressesSchema = (isSame = false) =>
  z.object({
    billing: addressFieldsSchema,
    ...(!isSame && { shipping: addressFieldsSchema }),
    shippingMethod: z
      .string()
      .min(1, { message: "shipping Method is required" }),
  });
const shippingMethodOption = [
  // { label: "Frieght - $159.81", value: "Frieght - $159.81", extra: 159.81 },
  { label: "Pre-Paid and Add", value: "Pre-Paid and Add" },
  { label: "Customer Carrier", value: "Customer Carrier" },
  { label: "Customer Pickup", value: "Customer Pickup" },
];
export function CheckoutAddress({ setIsActive }) {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const checkoutData = useSelector((state) => state.checkout.checkoutData);

  const dispatch = useDispatch();
  const { put } = ApiFunction();
  const [isSameAddress, setIsSameAddress] = useState(true);
  const countriesList = useSelector((state) => state.prod.countriesList) || [];
  const statesList = useSelector((state) => state.prod.statesList) || [];
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(addressesSchema(isSameAddress)),
    defaultValues: {
      shippingMethod: "",
      shipping: {
        fname: "",
        lname: "",
        company: "",
        phone: "",
        address1: "",
        address2: "",
        country: "",
        city: "",
        state: "",
        zipCode: "",
      },
      billing: {
        fname: "",
        lname: "",
        company: "",
        phone: "",
        address1: "",
        address2: "",
        country: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
  });
  const shippingCountry = watch("shipping.country");
  const shippingState = watch("shipping.state");
  const shippingStateList =
    statesList?.filter((item) => item?.country === shippingCountry) || [];

  const billngCountry = watch("billing.country");
  const billngState = watch("billing.state");
  const billingStateList =
    statesList?.filter((item) => item?.country === billngCountry) || [];

  const handleAddressUpdate = async (data) => {
    const billing = {
      ...data.billing,

      old_country_id: countriesList?.find((item) => item?._id === billngCountry)
        ?.old_id,
      country: countriesList?.find((item) => item?._id === billngCountry)?.name,
      countryID: countriesList?.find((item) => item?._id === billngCountry)
        ?._id,

      old_state_id: billingStateList?.find((item) => item?._id === billngState)
        ?.old_id,
      state: billingStateList?.find((item) => item?._id === billngState)?.name,
      stateID: billingStateList?.find((item) => item?._id === billngState)?._id,
    };
    const nData = {
      billing,
      shippingAddress: userData?.shippingAddress?._id,
      billingAddress: userData?.billingAddress?._id,
      shippingMethod: data?.shippingMethod,
      shipping: isSameAddress
        ? billing
        : {
            ...data.shipping,

            old_country_id: countriesList?.find(
              (item) => item?._id === shippingCountry
            )?.old_id,
            country: countriesList?.find(
              (item) => item?._id === shippingCountry
            )?.name,
            countryID: countriesList?.find(
              (item) => item?._id === shippingCountry
            )?._id,

            old_state_id: shippingStateList?.find(
              (item) => item?._id === shippingState
            )?.old_id,
            state: shippingStateList?.find(
              (item) => item?._id === shippingState
            )?.name,
            stateID: shippingStateList?.find(
              (item) => item?._id === shippingState
            )?._id,
          },
    };
    try {
      const additionalShippingValue =
        shippingMethodOption?.find(
          (item) => item?.value === nData?.shippingMethod
        )?.extra || 0;
      setIsActive("3");
      dispatch(
        setCheckoutData({
          ...checkoutData,
          ...nData,
          frieght: additionalShippingValue,
        })
      );
    } catch (error) {
      console.log(error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleValue = (row) => {
    setValue("shipping.fname", row?.shippingAddress?.fname);
    setValue("shipping.lname", row?.shippingAddress?.lname);
    setValue("shipping.company", row?.shippingAddress?.company);
    setValue("shipping.phone", row?.shippingAddress?.phone);
    setValue("shipping.address1", row?.shippingAddress?.address1);
    setValue("shipping.address2", row?.shippingAddress?.address2);
    setValue("shipping.country", row?.shippingAddress?.countryID);
    setValue("shipping.city", row?.shippingAddress?.city);
    setValue("shipping.state", row?.shippingAddress?.stateID);
    setValue("shipping.zipCode", row?.shippingAddress?.zipCode);

    setValue("billing.fname", row?.billingAddress?.fname);
    setValue("billing.lname", row?.billingAddress?.lname);
    setValue("billing.company", row?.billingAddress?.company);
    setValue("billing.phone", row?.billingAddress?.phone);
    setValue("billing.address1", row?.billingAddress?.address1);
    setValue("billing.address2", row?.billingAddress?.address2);
    setValue("billing.country", row?.billingAddress?.countryID);
    setValue("billing.city", row?.billingAddress?.city);
    setValue("billing.state", row?.billingAddress?.stateID);
    setValue("billing.zipCode", row?.billingAddress?.zipCode);
  };
  useEffect(() => {
    handleValue(userData);
  }, [userData]);
  // Render form field
  const renderField = (
    section,
    name,
    label,
    placeholder,
    type = "text",
    isDisabled = false,
    disabledMsg = "",
    selectList = []
  ) => {
    const fieldName = `${section}.${name}`;
    const fieldErrors = errors[section]?.[name];

    return (
      <div>
        <Label htmlFor={fieldName}>{label}</Label>
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) =>
            type === "phone" ? (
              <PhoneInput
                placeholder={placeholder}
                value={field.value}
                disabled={isDisabled}
                className="phone-input-container relative"
                onChange={(value) => field.onChange(value)}
              />
            ) : type === "select" ? (
              <Select
                {...field}
                disabled={isDisabled}
                aria-invalid={!!fieldErrors}
              >
                <SelectOption disabled value="">
                  {placeholder}
                </SelectOption>
                {selectList?.map((item, index) => (
                  <SelectOption key={index} value={item?._id}>
                    {item?.name}
                  </SelectOption>
                ))}
              </Select>
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                disabled={isDisabled}
                aria-invalid={!!fieldErrors}
              />
            )
          }
        />
        {isDisabled && <FormFeedback>{disabledMsg}</FormFeedback>}
        {fieldErrors && <FormFeedback>{fieldErrors.message}</FormFeedback>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(handleAddressUpdate)} className="space-y-6">
      {/* Billing Address Section */}
      <div className={`space-y-4 `}>
        <h2 className="text-xl font-bold">Billing Address</h2>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {renderField("billing", "fname", "First Name", "Enter first name")}
          {renderField("billing", "lname", "Last Name", "Enter last name")}
          {renderField("billing", "company", "Company", "Enter company name")}
          {renderField(
            "billing",
            "phone",
            "Phone Number",
            "Enter phone number",
            "phone"
          )}
          {renderField(
            "billing",
            "address1",
            "Address Line 1",
            "Enter street address"
          )}
          {renderField(
            "billing",
            "address2",
            "Address Line 2",
            "Enter apartment, suite, etc."
          )}
          {renderField(
            "billing",
            "country",
            "Country",
            "Select Country",
            "select",
            false,
            "",
            countriesList
          )}
          {renderField("billing", "city", "City", "Enter city")}
          {renderField(
            "billing",
            "state",
            "State/Province",
            "Enter state or province",
            "select",
            !billingStateList?.length > 0,
            "Please Select Country",
            billingStateList
          )}
          {renderField(
            "billing",
            "zipCode",
            "Zip/Postal Code",
            "Enter zip code"
          )}
        </div>
      </div>
      <div>
        <Label className="flex gap-2 items-center">
          <CheckBox
            className="mr-1"
            checked={isSameAddress}
            onChange={(e) => setIsSameAddress(e.target.checked)} // Update field value on change
          />
          Use this address as shipping Address
        </Label>
      </div>
      {/* Shipping Address Section */}
      {!isSameAddress && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Shipping Address</h2>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {renderField("shipping", "fname", "First Name", "Enter first name")}
            {renderField("shipping", "lname", "Last Name", "Enter last name")}
            {renderField(
              "shipping",
              "company",
              "Company",
              "Enter company name"
            )}
            {renderField(
              "shipping",
              "phone",
              "Phone Number",
              "Enter phone number",
              "phone"
            )}
            {renderField(
              "shipping",
              "address1",
              "Address Line 1",
              "Enter street address"
            )}
            {renderField(
              "shipping",
              "address2",
              "Address Line 2",
              "Enter apartment, suite, etc."
            )}
            {renderField(
              "shipping",
              "country",
              "Country",
              "Select Country",
              "select",
              false,
              "",
              countriesList
            )}
            {renderField("shipping", "city", "City", "Enter city")}
            {renderField(
              "shipping",
              "state",
              "State/Province",
              "Enter state or province",
              "select",
              !shippingStateList?.length > 0,
              "Please Select Country",
              shippingStateList
            )}
            {renderField(
              "shipping",
              "zipCode",
              "Zip/Postal Code",
              "Enter zip code"
            )}
          </div>
        </div>
      )}
      <h2 className="text-lg font-semibold">
        Shipping Method: Your Selection Will Be Reviewed By Your Assigned Sales
        Representative
      </h2>
      <div>
        {shippingMethodOption.map(({ label, value }) => (
          <div key={value} className="pb-3">
            <Controller
              name="shippingMethod"
              control={control}
              id={`shippingMethod-${value}`}
              render={({ field }) => (
                <Label className="font-normal text-sm flex items-center gap-3">
                  <RadioButton
                    {...field}
                    checked={field.value === value} // Ensure only the selected value is checked
                    onChange={() => field.onChange(value)} // Update form state correctly
                    value={value}
                    aria-invalid={!!errors.shippingMethod}
                  />
                  {label}
                </Label>
              )}
            />
            {errors.shippingMethod && (
              <FormFeedback>{errors.shippingMethod.message}</FormFeedback>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto w-full">
        <table className="w-full text-sm font-sans border-collapse">
          <thead>
            <tr className="bg-[#0a1f3c] text-white  font-semibold min-h-14">
              <th className="border-2 border-white px-6 py-3 text-left font-bold align-middle w-1/3 min-w-[200px]">
                Type of Order
              </th>
              <th className="border-2 border-white px-6 py-3 text-left font-bold align-middle w-1/3 min-w-[200px]">
                Domestic
              </th>
              <th className="border-2 border-white px-6 py-3 text-left font-bold align-middle w-1/3 min-w-[200px]">
                Export
                <div className="text-xs font-normal">
                  (incl. Packing and Paperwork)
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                As-Is (Pick and Pack)
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                1 day max.
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                2 days max.
              </td>
            </tr>
            <tr className="bg-gray-300 min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                Bar Saws ≤ 50 pcs. Standard Alloys
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>2 days max.</div>
                <div className="text-xs text-gray-600">
                  (includes pick time)
                </div>
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                3 days max.
              </td>
            </tr>
            <tr className="bg-white min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>Bar Saws ≤ 50 pcs.</div>
                <div className="text-xs text-gray-600">
                  Hard Alloys and All Ø {">"} 3.00" (75 mm)
                </div>
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>3 days max.</div>
                <div className="text-xs text-gray-600">
                  (includes pick time)
                </div>
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                4 days max.
              </td>
            </tr>
            <tr className="bg-gray-300 min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                Bar Saws {">"} 50 pcs.
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                Quote from planning
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                Quote from planning + 1 day
              </td>
            </tr>
            <tr className="bg-white min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>Plate Saw ≤ 50 pcs. ≤ 2.00" Thick</div>
                <div className="text-xs text-gray-600">
                  (incl. stripping and indexing)
                </div>
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>3 days max.</div>
                <div className="text-xs text-gray-600">
                  (includes pick time)
                </div>
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                4 days max.
              </td>
            </tr>
            <tr className="bg-gray-300 min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>Plate Saw ≤ 50 pcs. {">"} 2.00" Thick</div>
                <div className="text-xs text-gray-600">
                  (incl. stripping and indexing)
                </div>
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>4 days max.</div>
                <div className="text-xs text-gray-600">
                  (includes pick time)
                </div>
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                4 days max.
              </td>
            </tr>
            <tr className="bg-white min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                Plate Saw {">"} 50 pcs.
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                Quote from planning
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                Quote from planning + 1 day
              </td>
            </tr>
            <tr className="bg-gray-300 min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                Shear Cutting
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>2 days max.</div>
                <div className="text-xs text-gray-600">
                  (includes pick time)
                </div>
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                3 days max.
              </td>
            </tr>
            <tr className="bg-white border-b min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                Waterjet Cutting
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                <div>7 days max.</div>
                <div className="text-xs text-gray-600">
                  (includes pick time)
                </div>
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                8 days max.
              </td>
            </tr>
            <tr className="bg-gray-300 min-h-14">
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                Bonded Warehouse As-Is (P&P)
              </td>
              <td className="border-r border-white border-2 px-6 py-3 w-1/3 min-w-[200px]">
                2 days max. (3 - 5 for SHA)
              </td>
              <td className="px-6 border-b border-2 border-white py-3 w-1/3 min-w-[200px]">
                3 days max.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 items-center">
        <Button type="submit" className="" disabled={isLoading}>
          {isLoading ? "Updating..." : "Continue to Payment"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className=""
          onClick={() => setIsActive("1")}
          disabled={isLoading}
        >
          {"Previous"}
        </Button>
      </div>
    </form>
  );
}
