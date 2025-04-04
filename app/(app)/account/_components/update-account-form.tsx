"use client";

import { User } from "@/types";
import { createClient } from "@/utils/supabase/client/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { handleize } from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import { updateUser } from "../_actions";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/^(\+\d{1,3})?([-.\s]?\(?\d{1,3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/, "Invalid phone number")
    .optional(),
  bio: z.string().optional(),
  avatar_url: z.string().nullable(), // Will handle file upload separately
});

interface UpdateAccountFormProps {
  user: User;
}
export default function UpdateAccountForm({ user }: UpdateAccountFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const userImage = user.avatar_url
    ? user.avatar_url.startsWith("http")
      ? user.avatar_url
      : supabase.storage.from("media").getPublicUrl(user.avatar_url).data.publicUrl
    : null;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(userImage);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      full_name: user.full_name,
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      avatar_url: userImage,
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
        const fileName = `${handleize(formData.full_name)}-${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from("media").upload(filePath, imageFile);

        if (uploadError) throw uploadError;
        imagePath = filePath;
      }

      const updatedUser = await updateUser({
        userId: user.id,
        user: {
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
          ...(!!imagePath && { avatar_url: imagePath }),
        },
      });

      toast.success("Account Updated", { description: updatedUser.full_name });
      router.push(`/account`);
    } catch (error) {
      console.error(error);
      toast.error("Account Update Failed", {
        description: error instanceof Error ? error.message : "Something went wrong. Try again.",
      });
    }
  }

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
            <div className="flex items-start gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-2xl font-medium tracking-tight">{user.full_name}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold">Account Information</h2>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center gap-4 w-[200px]">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 w-full aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isDragActive ? "border-primary bg-primary/10" : "hover:bg-muted/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                      <div className="relative w-full h-full rounded-md overflow-hidden border">
                        <Image src={imagePreview} alt="Product preview" fill unoptimized className="object-contain" />
                      </div>
                    ) : (
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
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
                </div>
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself" rows={15} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
