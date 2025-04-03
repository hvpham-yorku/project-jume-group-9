import { Client } from "@/utils/supabase/types";

export async function getProduct({
  supabase,
  orgId,
  productId,
}: {
  supabase: Client;
  orgId: string;
  productId: string;
}) {
  return await supabase
    .from("products")
    .select("*, customer:customers(id, name, email)")
    .eq("id", productId)
    .eq("org_id", orgId)
    .single()
    .throwOnError();
}
