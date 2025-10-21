'use client'
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/formFeedBack";
import { toast } from "react-hot-toast";
import ApiFunction from "@/lib/api/apiFuntions";
import { handleError } from "@/lib/api/errorHandler";
import { CheckBox } from "../ui/checkbox";
import { Select, SelectOption } from "../ui/select";
import debounce from "debounce";
import SpinnerOverlay from "../ui/spinnerOverlay";

const schema = z.object({
  enableMailDelivery: z.boolean().optional(),
  sendMailsAs: z.string().email("Invalid email address"),
  sendCopyTo: z.string().optional(),
  interceptEmail: z.string().optional(),
  domain: z.string().min(1, "Required"),
  host: z.string().min(1, "Required"),
  port: z.string().min(1, "Required"),
  connection: z.string().optional(),
  authType: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export function MailSettingsForm() {
  const { post, get } = ApiFunction();
  const [isLoading, setIsLoading] = useState(false);
  const [isGetLoading, setIsGetLoading] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const nData = {
      enableMailDelivery: data?.enableMailDelivery,
      interceptEmail: data?.interceptEmail,
      sendCopyTo: data?.sendCopyTo,
      sendMailsAs: data?.sendMailsAs,
      smpt: {
        domain: data?.domain,
        host: data?.host,
        port: data?.port,
        authType: data?.authType,
        connection: data?.connection,
      },
      username: data?.username,
      password: data?.password,
    };
    await post("mail-setting/create", nData)
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
        }
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleSetData = (data) => {
    setValue("enableMailDelivery", data?.enableMailDelivery);
    setValue("interceptEmail", data?.interceptEmail);
    setValue("sendCopyTo", data?.sendCopyTo);
    setValue("sendMailsAs", data?.sendMailsAs);
    setValue("domain", data?.smpt?.domain);
    setValue("host", data?.smpt?.host);
    setValue("port", data?.smpt?.port);
    setValue("authType", data?.smpt?.authType);
    setValue("connection", data?.smpt?.connection);
    setValue("username", data?.smpt?.username || "");
  };
  const handleGet = debounce(async () => {
    setIsGetLoading(true);
    await get("mail-setting")
      .then((result) => {
        handleSetData(result?.mailSetting);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsGetLoading(false);
      });
  }, 300);
  useEffect(() => {
    handleGet();
  }, []);
  return (
    <>
      {isGetLoading && <SpinnerOverlay />}
      <form
        autoComplete="off"
        className="grid  md:grid-cols-2 gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-3">
          <div className="border-b pb-2">
            <h4 className="text-2xl  font-medium">General</h4>
          </div>
          <div>
            <Label className="flex gap-2 items-center">
              <Controller
                name="enableMailDelivery"
                control={control}
                render={({ field }) => (
                  <CheckBox
                    {...field}
                    aria-invalid={!!errors.enableMailDelivery}
                    className="mr-2"
                    checked={field.value} // Make sure the checkbox is linked to field.value
                    onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                  />
                )}
              />{" "}
              Enable Mail Delivery
            </Label>
          </div>

          <div>
            <Label>Send Mails As</Label>
            <Controller
              name="sendMailsAs"
              control={control}
              render={({ field }) => <Input {...field} type="email" />}
            />
            {errors.sendMailsAs && (
              <FormFeedback>{errors.sendMailsAs.message}</FormFeedback>
            )}
            <div>
              <p className="text-sm pt-1">
                Send all mails as from the following address.
              </p>
            </div>
          </div>

          <div>
            <Label>Send Copy of All Mails To</Label>
            <Controller
              name="sendCopyTo"
              control={control}
              render={({ field }) => <Input  {...field} />}
            />
            <div>
              <p className="text-sm pt-1">
                Sends a copy of all outgoing mails to this address. For multiple
                addresses, separate with commas.
              </p>
            </div>
          </div>

          <div>
            <Label>Intercept Email Address</Label>
            <Controller
              name="interceptEmail"
              control={control}
              render={({ field }) => <Input type="email" {...field} />}
            />
            <div>
              <p className="text-sm pt-1">
                Override email recipient and replace with this address.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="border-b pb-2">
            <h4 className="text-2xl  font-medium">SMPT</h4>
          </div>
          <div>
            <Label>SMTP Domain</Label>
            <Controller
              name="domain"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.domain && (
              <FormFeedback>{errors.domain.message}</FormFeedback>
            )}
          </div>

          <div>
            <Label>SMTP Mail Host</Label>
            <Controller
              name="host"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.host && <FormFeedback>{errors.host.message}</FormFeedback>}
          </div>

          <div>
            <Label>SMTP Port</Label>
            <Controller
              name="port"
              control={control}
              render={({ field }) => <Input {...field} type="number" />}
            />
            {errors.port && <FormFeedback>{errors.port.message}</FormFeedback>}
          </div>

          <div>
            <Label>Secure Connection Type</Label>
            <Controller
              name="connection"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectOption value="">None</SelectOption>
                  <SelectOption value="ssl">SSL</SelectOption>
                  <SelectOption value="tls">TLS</SelectOption>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>SMTP Authentication Type</Label>
            <Controller
              name="authType"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectOption value="">None</SelectOption>
                  <SelectOption value="plain">Plain</SelectOption>
                  <SelectOption value="login">Login</SelectOption>
                  <SelectOption value="cram_md5">cram_md5</SelectOption>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>SMTP Username</Label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <div>
            <Label>SMTP Password</Label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input {...field} type="password" />}
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </form>
    </>
  );
}
