import { UTCDate } from "@date-fns/utc";
import { Client } from "@/utils/supabase/types";
import { unstable_cache } from "@/lib/unstable-cache";

export type GetCustomersParams = {
  orgId: string;
  page: number;
  perPage: number;
  sort: {
    id: string;
    desc: boolean;
  };
  filter?: {
    name?: string | null;
    city?: string[];
    created_at?: number[];
  };
};

export async function getCustomers({ supabase, params }: { supabase: Client; params: GetCustomersParams }) {
  return await unstable_cache(
    async () => {
      const { orgId, sort, filter, page = 1, perPage = 10 } = params;
      const { name, city, created_at } = filter || {};

      const query = supabase.from("customers").select("*", { count: "exact" }).eq("org_id", orgId).throwOnError();

      /* -------------------------------------------------------------------------- */
      /*                                    sort                                    */
      /* -------------------------------------------------------------------------- */
      if (sort) {
        const { id, desc } = sort;
        const ascending = !desc;
        query.order(id, { ascending });
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
      /*                                    city                                    */
      /* -------------------------------------------------------------------------- */
      if (city?.length) {
        query.in("city", city);
      }

      const from = (page - 1) * perPage;
      const to = page * perPage - 1;
      const { data, count } = await query.range(from, to);

      return { data, count: count ?? 0, params };
    },
    [JSON.stringify(params)],
    {
      revalidate: 1,
      tags: ["customers"],
    },
  )();
}

export async function getCustomerCities({ supabase, orgId }: { supabase: Client; orgId: string }) {
  return unstable_cache(
    async () => {
      const { data: customers } = await supabase.from("customers").select("city").eq("org_id", orgId).throwOnError();

      const uniqueCities = new Set<string>();
      customers.forEach(({ city }) => {
        if (city && !uniqueCities.has(city)) {
          uniqueCities.add(city);
        }
      });

      return Array.from(uniqueCities);
    },
    ["customers-cities"],
    { revalidate: 3600 },
  )();
}

export async function getCustomer({
  supabase,
  orgId,
  customerId,
}: {
  supabase: Client;
  orgId: string;
  customerId: string;
}) {
  return await supabase.from("customers").select("*").eq("id", customerId).eq("org_id", orgId).single().throwOnError();
}
