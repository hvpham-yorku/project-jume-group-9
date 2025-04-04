import { UTCDate } from "@date-fns/utc";
import { Client, Database } from "@/utils/supabase/types";
import { unstable_cache } from "@/lib/unstable-cache";

export type GetOrdersParams = {
  orgId: string;
  page: number;
  perPage: number;
  sort: {
    id: string;
    desc: boolean;
  };
  filter?: {
    order_number?: number;
    fulfillment_status?: Database["public"]["Enums"]["fulfillment_status"][];
    created_at?: number[];
    total?: number[];
    quantity?: number[];
  };
};

export async function getOrders({ supabase, params }: { supabase: Client; params: GetOrdersParams }) {
  return await unstable_cache(
    async () => {
      const { orgId, sort, filter, page = 1, perPage = 10 } = params;
      const { fulfillment_status, created_at, order_number, total, quantity } = filter || {};

      const query = supabase
        .from("orders")
        .select(
          `
            *, 
            product:products(id, name, image, customer:customers(id, name, email))
          `,
          { count: "exact" },
        )
        .eq("org_id", orgId)
        .throwOnError();

      /* -------------------------------------------------------------------------- */
      /*                                    sort                                    */
      /* -------------------------------------------------------------------------- */
      if (sort) {
        const { id, desc } = sort;
        const ascending = !desc;
        if (id === "product") {
          query.order("product(name)", { ascending });
        } else {
          query.order(id, { ascending });
        }
      } else {
        query.order("created_at", { ascending: false }).order("id", { ascending: false });
      }

      /* -------------------------------------------------------------------------- */
      /*                                 created_at                                 */
      /* -------------------------------------------------------------------------- */
      if (created_at?.length) {
        if (created_at.length === 1) {
          const date = new UTCDate(created_at[0]);
          query.eq("created_at", date.toISOString());
        } else {
          const fromDate = new UTCDate(created_at[0]);
          const toDate = new UTCDate(created_at[1]);

          query.gte("created_at", fromDate.toISOString());
          query.lte("created_at", toDate.toISOString());
        }
      }

      /* -------------------------------------------------------------------------- */
      /*                                order_number                                */
      /* -------------------------------------------------------------------------- */
      if (order_number) {
        query.eq("order_number", order_number);
      }

      /* -------------------------------------------------------------------------- */
      /*                             fulfillment_status                             */
      /* -------------------------------------------------------------------------- */
      if (fulfillment_status?.length) {
        query.in("fulfillment_status", fulfillment_status);
      }

      /* -------------------------------------------------------------------------- */
      /*                                    total                                   */
      /* -------------------------------------------------------------------------- */
      if (total?.length) {
        if (total.length === 1) {
          query.eq("total", total[0]);
        } else {
          const fromTotal = total[0];
          const toTotal = total[1];

          query.gte("total", fromTotal);
          query.lte("total", toTotal);
        }
      }

      /* -------------------------------------------------------------------------- */
      /*                                 quantity                                */
      /* -------------------------------------------------------------------------- */
      if (quantity?.length) {
        if (quantity.length === 1) {
          query.eq("quantity", quantity[0]);
        } else {
          const fromQuantity = quantity[0];
          const toQuantity = quantity[1];

          query.gte("quantity", fromQuantity);
          query.lte("quantity", toQuantity);
        }
      }

      const from = (page - 1) * perPage;
      const to = page * perPage - 1;
      const { data, count } = await query.range(from, to);

      // console.log({ data, count, params });

      return { data, count: count ?? 0, params };
    },
    [JSON.stringify(params)],
    {
      revalidate: 1,
      tags: ["orders"],
    },
  )();
}

export async function getOrdersTotalRange({ supabase, orgId }: { supabase: Client; orgId: string }) {
  return await unstable_cache(
    async () => {
      const { data: minData } = await supabase
        .from("orders")
        .select("total")
        .eq("org_id", orgId)
        .order("total", { ascending: true })
        .limit(1)
        .single()
        .throwOnError();

      const { data: maxData } = await supabase
        .from("orders")
        .select("total")
        .eq("org_id", orgId)
        .order("total", { ascending: false })
        .limit(1)
        .single()
        .throwOnError();

      return { min: minData?.total, max: maxData?.total };
    },
    ["orders-total-range"],
    {
      revalidate: 3600,
    },
  )();
}

export async function getOrdersQuantityRange({ supabase, orgId }: { supabase: Client; orgId: string }) {
  return await unstable_cache(
    async () => {
      const { data: minData } = await supabase
        .from("orders")
        .select("quantity")
        .eq("org_id", orgId)
        .order("quantity", { ascending: true })
        .limit(1)
        .single()
        .throwOnError();

      const { data: maxData } = await supabase
        .from("orders")
        .select("quantity")
        .eq("org_id", orgId)
        .order("quantity", { ascending: false })
        .limit(1)
        .single()
        .throwOnError();

      return { min: minData?.quantity, max: maxData?.quantity };
    },
    ["orders-quantity-range"],
    {
      revalidate: 3600,
    },
  )();
}

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
