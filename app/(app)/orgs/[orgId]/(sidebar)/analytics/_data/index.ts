import { Client } from "@/utils/supabase/types";
import { UTCDate } from "@date-fns/utc";
import { DateRange } from "react-day-picker";

interface GetDashboardDataProps {
  supabase: Client;
  orgId: string;
  date?: DateRange;
}
export async function getDashboardData({ supabase, orgId, date }: GetDashboardDataProps) {
  const [productData, ordersData] = await Promise.all([
    getProductData({ supabase, orgId, date }),
    getOrdersData({ supabase, orgId, date }),
  ]);

  return {
    ...productData,
    ...ordersData,
  };
}

export async function getProductData({ supabase, orgId, date }: GetDashboardDataProps) {
  const query = supabase
    .from("products")
    .select("*, customer:customers(id, name)", { count: "exact" })
    .eq("org_id", orgId);

  if (date) {
    if (date.from) {
      const fromDate = new UTCDate(date.from);
      query.gte("created_at", fromDate.toISOString());
    }
    if (date.to) {
      const toDate = new UTCDate(date.to);
      query.lte("created_at", toDate.toISOString());
    }
  }

  const { data: products, count } = await query.throwOnError();

  const totalInventory = products?.reduce((acc, product) => acc + product.inventory_quantity, 0) ?? 0;
  const totalPrice = products?.reduce((acc, product) => acc + product.price * product.inventory_quantity, 0) ?? 0;

  return {
    products,
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

export async function getOrdersData({ supabase, orgId, date }: GetDashboardDataProps) {
  const query = supabase.from("orders").select("*", { count: "exact" }).eq("org_id", orgId);

  if (date) {
    if (date.from) {
      const fromDate = new UTCDate(date.from);
      query.gte("created_at", fromDate.toISOString());
    }
    if (date.to) {
      const toDate = new UTCDate(date.to);
      query.lte("created_at", toDate.toISOString());
    }
  }

  const { data: orders, count } = await query.throwOnError();

  return { orders, totalOrders: count ? count.toLocaleString() : 0 };
}
