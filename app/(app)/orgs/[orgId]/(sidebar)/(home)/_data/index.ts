import { Client } from "@/utils/supabase/types";

interface GetDashboardDataProps {
  supabase: Client;
  orgId: string;
}
export async function getDashboardData({ supabase, orgId }: GetDashboardDataProps) {
  const [{ data: notifications }, { data: activityLogs }, productData, ordersData] = await Promise.all([
    getNotifications({ supabase, orgId }),
    getActivityLogs({ supabase, orgId }),
    getProductData({ supabase, orgId }),
    getOrdersData({ supabase, orgId }),
  ]);

  return {
    notifications: notifications ?? [],
    activityLogs: activityLogs ?? [],
    ...productData,
    ...ordersData,
  };
}

export async function getNotifications({ supabase, orgId }: GetDashboardDataProps) {
  const { data, error } = await supabase
    .from("product_restock_notifications")
    .select("*, product:products(id, name, image, inventory_quantity, restock_threshold)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(10);

  return { data: data ?? [], error };
}

export async function getActivityLogs({ supabase, orgId }: GetDashboardDataProps) {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, user:users(id, full_name, email, avatar_url)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(10);

  return { data: data ?? [], error };
}

export async function getProductData({ supabase, orgId }: GetDashboardDataProps) {
  const { data: products, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .eq("org_id", orgId)
    .throwOnError();

  const totalInventory = products?.reduce((acc, product) => acc + product.inventory_quantity, 0) ?? 0;
  const totalPrice = products?.reduce((acc, product) => acc + product.price * product.inventory_quantity, 0) ?? 0;

  return {
    products: products.slice(0, 10),
    totalProducts: count ?? 0,
    totalInventory: totalInventory.toLocaleString(),
    totalPrice: totalPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };
}

export async function getOrdersData({ supabase, orgId }: GetDashboardDataProps) {
  const { data: orders, count } = await supabase
    .from("orders")
    .select("*, product:products(id, name, image)", { count: "exact" })
    .order("created_at", { ascending: false })
    .eq("org_id", orgId)
    .throwOnError();

  return { orders: orders.slice(0, 10), totalOrders: count ? count.toLocaleString() : 0 };
}
