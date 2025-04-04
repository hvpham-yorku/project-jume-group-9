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

                  {product && (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-full whitespace-nowrap">Product</TableHead>
                            <TableHead className="w-[150px] whitespace-nowrap">Inventory</TableHead>
                            <TableHead className="w-[150px] whitespace-nowrap">Threshold</TableHead>
                            <TableHead className="w-[200px] whitespace-nowrap">Quantity</TableHead>
                            <TableHead className="w-[150px] whitespace-nowrap">Total</TableHead>
                            <TableHead className="text-right"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <ProductItem product={product} />
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{product?.inventory_quantity}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{product?.restock_threshold}</span>
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input type="number" className="min-w-[100px]" min={1} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">${total.toFixed(2)}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => setProduct(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
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

      <ProductsModal open={open} setOpen={setOpen} product={product} setProduct={setProduct} />
    </div>
  );
}

interface ProductsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: Product | null;
  setProduct: (product: Product | null) => void;
}
function ProductsModal({ open, setOpen, product, setProduct }: ProductsModalProps) {
  const supabase = createClient();
  const { orgId } = useParams<{ orgId: string }>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // debounce search
  const deferredSearch = useDeferredValue(search);

  async function getAllProducts() {
    if (!orgId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const ac = new AbortController();
    abortControllerRef.current = ac;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*, customer:customers(id, name, email)")
        .eq("org_id", orgId)
        .order("name", { ascending: true })
        .limit(100)
        .ilike("name", `%${deferredSearch}%`)
        .abortSignal(ac.signal);

      console.log({ data, error });

      if (!data || error) throw error;

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    getAllProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [open, deferredSearch]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <DialogTitle>All Products</DialogTitle>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="pl-8"
            />
          </div>
        </DialogHeader>
        <div className="grid content-start  border-y overflow-y-auto h-[30rem]">
          {loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="p-4 flex gap-2 items-center border-b w-full">
                <ProductItemSkeleton />
              </div>
            ))}
          {!loading &&
            products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 flex justify-between gap-2 cursor-pointer transition-all hover:bg-muted/50 data-[state=selected]:bg-muted items-center border-b w-full"
                data-state={prod.id === product?.id ? "selected" : "unselected"}
                onClick={() => setProduct(prod.id === product?.id ? null : prod)}
              >
                <ProductItem product={prod} />
                {prod.id === product?.id && <Check className="size-4" />}
              </div>
            ))}
          {!loading && products.length === 0 && (
            <div className="p-4 flex flex-col gap-2 items-center size-full justify-center">
              <p className="text-sm text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} disabled={!product}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

function ProductItemSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="size-12 flex items-center justify-center rounded overflow-hidden bg-muted text-muted-foreground p-1 border">
        <ImageIcon className="size-4" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-3 w-32 bg-muted rounded" />
        <div className="h-3 w-16 bg-muted rounded" />
      </div>
    </div>
  );
}
