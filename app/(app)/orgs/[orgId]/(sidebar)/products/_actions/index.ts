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
