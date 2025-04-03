"use server";

import { createClient } from "@/utils/supabase/client/server";
import { addActivityLog } from "@/app/actions";
import { Database } from "@/utils/supabase/types";
import { revalidateTag, unstable_noStore } from "next/cache";

/* -------------------------------------------------------------------------- */
/*                                createProduct                               */
/* -------------------------------------------------------------------------- */
interface CreateProductProps {
  orgId: string;
  product: Database["public"]["Tables"]["products"]["Insert"];
}
export const createProduct = async ({ orgId, product }: CreateProductProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: createdProduct } = await supabase.from("products").insert(product).select("*").single().throwOnError();

  revalidateTag("products");

  await addActivityLog({
    orgId: orgId,
    action: `Product: Create`,
    description: `Product "${createdProduct.name}" has been created.`,
  });

  return createdProduct;
};

/* -------------------------------------------------------------------------- */
/*                                updateProduct                               */
/* -------------------------------------------------------------------------- */
interface UpdateProductProps {
  orgId: string;
  productId: string;
  product: Database["public"]["Tables"]["products"]["Update"];
}
export const updateProduct = async ({ orgId, productId, product }: UpdateProductProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: updatedProduct } = await supabase
    .from("products")
    .update(product)
    .eq("id", productId)
    .eq("org_id", orgId)
    .select("*")
    .single()
    .throwOnError();

  revalidateTag("products");

  await addActivityLog({
    orgId: orgId,
    action: `Product: Update`,
    description: `Product "${updatedProduct.name}" has been updated`,
  });

  return updatedProduct;
};