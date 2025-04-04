"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCustomers } from "../_data";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client/client";
import { useDropzone } from "react-dropzone";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Database } from "@/utils/supabase/types";
import { FaCircle } from "react-icons/fa";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { createProduct } from "../_actions";
import { v4 as uuidv4 } from "uuid";
import { handleize } from "@/utils/utils";

type Customer = Awaited<ReturnType<typeof getCustomers>>["data"][number];
type ProductStatus = Database["public"]["Enums"]["product_status"];

const FormSchema = z.object({
  customer_id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  inventory_quantity: z.coerce.number().int().min(0, "Inventory must be a non-negative number"),
  // image: z.string().nullable(), // Will handle file upload separately
  image: z.instanceof(File).optional(), // Will handle file upload separately
  category: z.string().optional(),
  sku: z
    .string()
    .regex(/^[A-Z0-9-]+$/, "SKU must contain only uppercase letters, numbers, optionally sep dashes, no space")
    .optional(),
  restock_threshold: z.coerce.number().int().min(1, "Threshold must be at least 1").default(10),
  status: z.enum(["active", "draft", "archived"] satisfies z.EnumValues<ProductStatus>).default("draft"),
});

export function CreateProductForm() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const supabase = createClient();
  const { orgId } = useParams<{ orgId: string }>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      inventory_quantity: 10,
      category: "",
      sku: "",
      restock_threshold: 10,
      status: "draft",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    try {
      let imagePath = null;

      // Handle image upload if there's a file
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${handleize(formData.name)}-${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from("media").upload(filePath, imageFile);

        if (uploadError) throw uploadError;
        imagePath = filePath;
      }

      const createdProduct = await createProduct({
        orgId,
        product: {
          org_id: orgId,
          customer_id: formData.customer_id,
          name: formData.name,
          description: formData.description ?? null,
          price: formData.price,
          inventory_quantity: formData.inventory_quantity,
          image: imagePath,
          category: formData.category ?? null,
          sku: formData.sku ?? null,
          restock_threshold: formData.restock_threshold,
          status: formData.status,
        },
      });

      toast.success("Product Created", { description: createdProduct.name });
      router.push(`/orgs/${orgId}/products/${createdProduct.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Product Creation Failed", {
        description: error instanceof Error ? error.message : "Something went wrong. Try again.",
      });
    }
  }

  // Fetch customers for the dropdown
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data: customers } = await getCustomers({ supabase, orgId });
        setCustomers(customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers");
      }
    }

    fetchCustomers();
  }, [orgId, supabase]);

  // Setup dropzone for image upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
  });

  return (
    <div className="w-full container">
      <Form {...form}>
        <form className="grid p-8 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-medium tracking-tight">Create Product</h1>
            </div>
            <Button size="sm" type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold">Product Information</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Product description" rows={15} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative flex-1">
                              <div className="absolute left-2.5 top-[50%] translate-y-[-50%] leading-[100%] w-4 text-muted-foreground">
                                $
                              </div>
                              <Input type="text" placeholder="0.00" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="SKU (Stock Keeping Unit)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold">Status</h2>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">
                                <div className="flex items-center gap-2">
                                  <FaCircle className="size-[0.8em] text-cyan-300" />
                                  Draft
                                </div>
                              </SelectItem>
                              <SelectItem value="active">
                                <div className="flex items-center gap-2">
                                  <FaCircle className="size-[0.8em] text-green-400" />
                                  Active
                                </div>
                              </SelectItem>
                              <SelectItem value="archived">
                                <div className="flex items-center gap-2">
                                  <FaCircle className="size-[0.8em] text-orange-500" />
                                  Archived
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold">Customer</h2>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}

                            <Separator className="my-2" />

                            <Button variant="ghost" size="sm" asChild className="w-full">
                              <Link href={`/orgs/${orgId}/customers/new`} className="flex items-center gap-2">
                                <Plus className="size-[0.8em] text-muted-foreground" />
                                New Customer
                              </Link>
                            </Button>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold">Inventory Management</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="inventory_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory Quantity</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Current inventory" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="restock_threshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory Restock Threshold</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Restock threshold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold">Product Image</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-md p-4 w-full aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isDragActive ? "border-primary bg-primary/10" : "hover:bg-muted/50"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {imagePreview ? (
                        <div className="relative w-full h-full bg-white rounded-md overflow-hidden border">
                          <Image src={imagePreview} alt="Product preview" fill unoptimized className="object-contain" />
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground text-center">
                            {isDragActive ? "Drop the image here" : "Drag & drop an image here, or click to select"}
                          </p>
                        </>
                      )}
                    </div>

                    {imageFile && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm truncate max-w-[200px]">{imageFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
