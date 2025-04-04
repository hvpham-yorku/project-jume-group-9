"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createCustomer } from "../_actions";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^(\+\d{1,3})?([-.\s]?\(?\d{1,3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/, "Invalid phone number")
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  region_code: z.string().optional(),
  country: z.string().optional(),
  country_code: z.string().optional(),
  postal_code: z.string().optional(),
});

export function CreateCustomerForm() {
  const router = useRouter();
  const { orgId } = useParams<{ orgId: string }>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      region_code: "",
      country: "",
      country_code: "",
      postal_code: "",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    try {
      const createdCustomer = await createCustomer({
        orgId,
        customer: {
          org_id: orgId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone ?? null,
          address: formData.address ?? null,
          city: formData.city ?? null,
          region: formData.region ?? null,
          region_code: formData.region_code ?? null,
          country: formData.country ?? null,
          country_code: formData.country_code ?? null,
          postal_code: formData.postal_code ?? null,
        },
      });

      toast.success("Customer Created", { description: createdCustomer.name });
      router.push(`/orgs/${orgId}/customers/${createdCustomer.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Customer Creation Failed", {
        description: error instanceof Error ? error.message : "Something went wrong. Try again.",
      });
    }
  }

  return (
    <div className="w-full container">
      <Form {...form}>
        <form className="grid p-8 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-medium tracking-tight">Create Customer</h1>
            </div>
            <Button size="sm" type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold">Customer Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region Code</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Region Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Country Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
