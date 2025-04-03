"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getProduct } from "../_data";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, ImageIcon, Info, Loader2, Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { createOrder } from "../_actions";

const FormSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.coerce.number().min(1), // must be a number and greater than 0
  notes: z.string().max(1000).optional(), // must be a string and less than 1000 characters
});

type Product = Awaited<ReturnType<typeof getProduct>>["data"];

interface CreateOrderFormProps {
  product?: Product;
}
export function CreateOrderForm(props: CreateOrderFormProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(props.product ?? null);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const { orgId } = useParams<{ orgId: string }>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const {
    watch,
    setValue,
    formState: { isValid, isSubmitting },
  } = form;

  const quantity = watch("quantity");
  const total = product ? product.price * quantity : 0;

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    console.log(formData);

    try {
      const createdOrder = await createOrder({
        orgId,
        order: {
          org_id: orgId,
          product_id: formData.product_id,
          quantity: formData.quantity,
          notes: formData.notes ?? "",
          total: +total.toFixed(2),
        },
      });

      toast.success("Order Created", { description: `#${createdOrder.order_number}` });
      router.push(`/orgs/${orgId}/orders/${createdOrder.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Order Creation Failed", {
        description: error instanceof Error ? error.message : "Something went wrong. Try again.",
      });
    }
  }

  useEffect(() => {
    if (product) {
      setValue("quantity", 1);
      setValue("product_id", product.id);
    }
  }, [product]);

  return (
    <div className="w-full container">
      <Form {...form}>
        <form className="grid p-8 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-medium tracking-tight">Create Order</h1>
            </div>
            <Button size="sm" type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <h2 className="text-base font-semibold">Select Product</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        onFocus={(e) => {
                          setOpen(true);
                          e.target.blur();
                        }}
                        placeholder="Search products"
                        className="pl-8"
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={() => setOpen(true)}>
                      Browse
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <h2 className="text-base font-semibold">Payment</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <span>Subtotal</span>
                        {product && <span className="text-muted-foreground"> {quantity} item(s)</span>}
                      </div>
                      {product ? <span>${total.toFixed(2)}</span> : <span>—</span>}
                    </div>
                    <div className="flex justify-between">
                      <span>Discounts</span>
                      {product ? <span>$0.00</span> : <span>—</span>}
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      {product ? <span>$0.00</span> : <span>—</span>}
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span>Estimated tax</span>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {product ? <span className="text-muted-foreground">Not calculated</span> : <span>—</span>}
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <div>Total</div>
                      <div>${total.toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <h2 className="text-base font-semibold">Notes</h2>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea rows={10} placeholder="Add any notes about the order here..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

    </div>
  );
}
