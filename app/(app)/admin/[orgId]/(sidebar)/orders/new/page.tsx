"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { createOrder } from "@/utils/supabase/mutations/order-mutations";

const formSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  customerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  products: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1, {
          message: "Quantity must be at least 1.",
        }),
      }),
    )
    .min(1, {
      message: "Please add at least one product.",
    }),
  shippingAddress: z.string().min(5, {
    message: "Shipping address is required.",
  }),
  notes: z.string().optional(),
});

export default function NewOrderPage({ params }) {
  const { orgId } = params;
  const router = useRouter();
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [orderItems, setOrderItems] = React.useState([{ productId: "", quantity: 1 }]);

  // Fetch products on page load
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?orgId=${orgId}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, [orgId]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      products: [],
      shippingAddress: "",
      notes: "",
    },
  });

  function onSubmit(values) {
    setIsLoading(true);

    const orderData = {
      orgId,
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      items: values.products,
      shippingAddress: values.shippingAddress,
      notes: values.notes || "",
    };

    try {
      // Submit order to your backend
      //   createOrder(orderData);
      toast.success("Order created successfully!");
      router.push(`/admin/${orgId}/orders`);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order");
    } finally {
      setIsLoading(false);
    }
  }

  const addProductLine = () => {
    setOrderItems([...orderItems, { productId: "", quantity: 1 }]);
  };

  const removeProductLine = (index) => {
    if (orderItems.length > 1) {
      const updatedItems = [...orderItems];
      updatedItems.splice(index, 1);
      setOrderItems(updatedItems);
    }
  };

  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = field === "quantity" ? parseInt(value, 10) : value;
    setOrderItems(updatedItems);

    // Update form values
    form.setValue("products", updatedItems);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
          <CardDescription>Fill out the form below to create a new customer order.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Products</FormLabel>
                <FormDescription>Add products to this order</FormDescription>

                <div className="space-y-4 mt-2">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <FormLabel className="text-sm">Product</FormLabel>
                        <Select
                          value={item.productId}
                          onValueChange={(value) => updateOrderItem(index, "productId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} (${product.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-24">
                        <FormLabel className="text-sm">Quantity</FormLabel>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, "quantity", e.target.value)}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeProductLine(index)}
                        className="mb-0.5"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>

                <Button type="button" variant="outline" size="sm" onClick={addProductLine} className="mt-2">
                  Add Product
                </Button>
              </div>

              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Special instructions or notes for this order" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push(`/admin/${orgId}/orders`)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Order"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
