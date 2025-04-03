import { Client, Database } from "@/utils/supabase/types";

export async function getOrder({ supabase, orgId, orderId }: { supabase: Client; orgId: string; orderId: string }) {
  return await supabase
    .from("orders")
    .select("*, product:products(*, customer:customers(id, name, email))")
    .eq("id", orderId)
    .eq("org_id", orgId)
    .single()
    .throwOnError();
}

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
