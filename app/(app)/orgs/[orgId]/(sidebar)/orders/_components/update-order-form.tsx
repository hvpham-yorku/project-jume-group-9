"use client";

import { getOrder } from "../_data";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Info, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client/client";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/utils/supabase/types";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaCircle } from "react-icons/fa";
import { deleteOrders, updateOrder } from "../_actions";

type Order = Awaited<ReturnType<typeof getOrder>>["data"];
type FulfillmentStatus = Database["public"]["Enums"]["fulfillment_status"];

const FormSchema = z.object({
  fulfillment_status: z.enum(["pending", "fulfilled", "cancelled"] satisfies z.EnumValues<FulfillmentStatus>),
  notes: z.string().max(1000).optional(),
});

interface UpdateOrderFormProps {
  order: Order;
}
export function UpdateOrderForm({ order }: UpdateOrderFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const { orgId } = useParams<{ orgId: string }>();

  const [isDeleting, setIsDeleting] = useState(false);

  const updatedAt = useMemo(() => {
    return new Date(order.updated_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }, [order.updated_at]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fulfillment_status: order.fulfillment_status,
      notes: order.notes ?? "",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    console.log(formData);

    try {
      const updatedOrder = await updateOrder({
        orgId,
        orderId: order.id,
        order: {
          fulfillment_status: formData.fulfillment_status,
          notes: formData.notes,
        },
      });

      toast.success("Order Updated", { description: `#${updatedOrder.order_number}` });
      router.push(`/orgs/${orgId}/orders`);
    } catch (error) {
      console.error(error);
      toast.error("Order Update Failed", {
        description: error instanceof Error ? error.message : "Something went wrong. Try again.",
      });
    }
  }

  async function onDelete() {
    try {
      setIsDeleting(true);
      const [deletedOrder] = await deleteOrders({ orgId, orderIds: [order.id] });
      toast.success("Order Deleted", { description: deletedOrder.order_number });
      router.push(`/orgs/${orgId}/orders`);
    } catch (error) {
      console.error(error);
      toast.error("Order Deletion Failed", {
        description: error instanceof Error ? error.message : "Something went wrong. Try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="w-full container">
      <Form {...form}>
        <form className="grid p-8 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-2xl font-medium tracking-tight">Order #{order.order_number}</h1>
                <p className="text-sm text-muted-foreground">Last update: {updatedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                type="button"
                onClick={onDelete}
                variant="destructive"
                disabled={isDeleting || isSubmitting}
              >
                {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
              </Button>
              <Button size="sm" type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <h2 className="text-base font-semibold">Product</h2>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-full whitespace-nowrap">Product</TableHead>
                          <TableHead className="w-[150px] whitespace-nowrap">Inventory</TableHead>
                          <TableHead className="w-[150px] whitespace-nowrap">Threshold</TableHead>
                          <TableHead className="w-[200px] whitespace-nowrap">Quantity</TableHead>
                          <TableHead className="w-[150px] whitespace-nowrap">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <ProductItem product={order.product} />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{order.product.inventory_quantity}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{order.product.restock_threshold}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{order.quantity}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">${order.total.toFixed(2)}</span>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
                        <span className="text-muted-foreground"> {order.quantity} item(s)</span>
                      </div>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discounts</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span>Estimated tax</span>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground">Not calculated</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <div>Total</div>
                      <div>${order.total.toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <h2 className="text-base font-semibold">Fulfillment Status</h2>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="fulfillment_status"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a fulfillment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <FaCircle className="size-[0.8em] text-yellow-500" />
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem value="fulfilled">
                              <div className="flex items-center gap-2">
                                <FaCircle className="size-[0.8em] text-green-400" />
                                Fulfilled
                              </div>
                            </SelectItem>
                            <SelectItem value="cancelled">
                              <div className="flex items-center gap-2">
                                <FaCircle className="size-[0.8em] text-red-500" />
                                Cancelled
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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

function ProductItem({ product }: { product: Product }) {
  const supabase = createClient();
  const image = product.image ? supabase.storage.from("media").getPublicUrl(product.image).data.publicUrl : null;

  return (
    <div className="flex items-center gap-2">
      <div className="size-12 rounded overflow-hidden bg-white text-muted-foreground p-1 border">
        <div className="relative size-full flex items-center justify-center">
          {image ? (
            <Image
              src={`${image}?width=100&height=100`}
              alt={product.name}
              fill
              unoptimized
              className="object-contain"
            />
          ) : (
            <ImageIcon className="size-4" />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <p className="max-w-full text-sm truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          {product.customer.name} • ${product.price}
        </p>
      </div>
    </div>
  );
}
