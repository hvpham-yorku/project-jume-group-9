import { UTCDate } from "@date-fns/utc";
import { Client, Database } from "@/utils/supabase/types";
import { unstable_cache } from "@/lib/unstable-cache";

export type GetProductsParams = {
  orgId: string;
  page: number;
  perPage: number;
  sort: {
    id: string;
    desc: boolean;
  };
  filter?: {
    name?: string | null;
    category?: string[];
    status?: Database["public"]["Enums"]["product_status"][];
    created_at?: number[];
    price?: number[];
    inventory_quantity?: number[];
    customer?: string[];
  };
};

export async function getProducts({ supabase, params }: { supabase: Client; params: GetProductsParams }) {
  return await unstable_cache(
    async () => {
      const { orgId, sort, filter, page = 1, perPage = 10 } = params;
      const { name, category, status, created_at, price, inventory_quantity } = filter || {};

      const query = supabase
        .from("products")
        .select(
          `
          *,
          customer:customers(id, name, email)
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
        if (id === "customer") {
          query.order("customer(name)", { ascending });
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
      /*                                    name                                    */
      /* -------------------------------------------------------------------------- */
      if (name) {
        query.ilike("name", `%${name}%`);
      }

      /* -------------------------------------------------------------------------- */
      /*                                  category                                  */
      /* -------------------------------------------------------------------------- */
      if (category) {
        query.ilike("category", `%${category}%`);
      }

      /* -------------------------------------------------------------------------- */
      /*                                   status                                   */
      /* -------------------------------------------------------------------------- */
      if (status?.length) {
        query.in("status", status);
      }

      /* -------------------------------------------------------------------------- */
      /*                                    price                                   */
      /* -------------------------------------------------------------------------- */
      if (price?.length) {
        if (price.length === 1) {
          query.eq("price", price[0]);
        } else {
          const fromPrice = price[0];
          const toPrice = price[1];

          query.gte("price", fromPrice);
          query.lte("price", toPrice);
        }
      }

      /* -------------------------------------------------------------------------- */
      /*                                 quantity                                */
      /* -------------------------------------------------------------------------- */
      if (inventory_quantity?.length) {
        if (inventory_quantity.length === 1) {
          query.eq("inventory_quantity", inventory_quantity[0]);
        } else {
          const fromInventoryQuantity = inventory_quantity[0];
          const toInventoryQuantity = inventory_quantity[1];

          query.gte("inventory_quantity", fromInventoryQuantity);
          query.lte("inventory_quantity", toInventoryQuantity);
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
      tags: ["products"],
    },
  )();
}

export async function getProductsPriceRange({ supabase, orgId }: { supabase: Client; orgId: string }) {
  return unstable_cache(
    async () => {
      const { data: minData } = await supabase
        .from("products")
        .select("price")
        .eq("org_id", orgId)
        .order("price", { ascending: true })
        .limit(1)
        .single()
        .throwOnError();

      const { data: maxData } = await supabase
        .from("products")
        .select("price")
        .eq("org_id", orgId)
        .order("price", { ascending: false })
        .limit(1)
        .single()
        .throwOnError();

      return { min: minData?.price, max: maxData?.price };
    },
    ["products-price-range"],
    {
      revalidate: 3600,
    },
  )();
}

export async function getProductsInventoryQuantityRange({ supabase, orgId }: { supabase: Client; orgId: string }) {
  return unstable_cache(
    async () => {
      const { data: minData } = await supabase
        .from("products")
        .select("inventory_quantity")
        .eq("org_id", orgId)
        .order("inventory_quantity", { ascending: true })
        .limit(1)
        .single()
        .throwOnError();

      const { data: maxData } = await supabase
        .from("products")
        .select("inventory_quantity")
        .eq("org_id", orgId)
        .order("inventory_quantity", { ascending: false })
        .limit(1)
        .single()
        .throwOnError();

      return { min: minData?.inventory_quantity, max: maxData?.inventory_quantity };
    },
    ["products-inventory-quantity-range"],
    { revalidate: 3600 },
  )();
}

export async function getProductsCategories({ supabase, orgId }: { supabase: Client; orgId: string }) {
  return unstable_cache(
    async () => {
      const { data: products } = await supabase.from("products").select("category").eq("org_id", orgId).throwOnError();

      const uniqueCategories = new Set<string>();
      products.forEach(({ category }) => {
        if (category && !uniqueCategories.has(category)) {
          uniqueCategories.add(category);
        }
      });

      return Array.from(uniqueCategories);
    },
    ["products-categories"],
    { revalidate: 3600 },
  )();
}

export async function getCustomers({ supabase, orgId }: { supabase: Client; orgId: string }) {
  return await supabase
    .from("customers")
    .select("*")
    .eq("org_id", orgId)
    .order("name", { ascending: true })
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
