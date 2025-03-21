import "server-only";


import { Client } from "../types"

export async function getUserQuery({supabase, userId}: {supabase: Client, userId: string}) {
  return supabase.from("users").select("*").eq("id", userId).single().throwOnError();
}

export async function getOrgQuery({supabase, orgId}: {supabase: Client, orgId: string}) {
  return supabase.from("orgs").select("*").eq("id", orgId).single().throwOnError();
}

export async function getOrgMemberByUserIdQuery({supabase, userId, orgId}: {supabase: Client, userId: string, orgId: string}) {
  return supabase.from("org_members").select("*").eq("user_id", userId).eq("org_id", orgId).single().throwOnError();
}

export async function getOrdersQuery({supabase, orgId}: {supabase: Client, orgId: string}) {
  return supabase.from("orders").select(
    `
    *,
    product:products(
      id,
      name,
      images
    )
    `
  ).eq("org_id", orgId).order("created_at", { ascending: false }).throwOnError();
}

export async function getProductRestockNotificationsQuery({supabase, orgId}: {supabase: Client, orgId: string}) {
  return supabase.from("product_restock_notifications").select(`
    *,
    product:products(
      id,
      name,
      inventory_quantity
    )
  `).eq("org_id", orgId).throwOnError();
}
export async function getProductsQuery({supabase, orgId}: {supabase: Client, orgId: string}) {
  return supabase.from("products").select("*").eq("org_id", orgId).throwOnError();
}

