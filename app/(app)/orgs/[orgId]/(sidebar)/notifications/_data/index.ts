import { UTCDate } from "@date-fns/utc";
import { Client } from "@/utils/supabase/types";
import { unstable_cache } from "@/lib/unstable-cache";

export type GetNotificationsParams = {
  orgId: string;
  page: number;
  perPage: number;
  sort: {
    id: string;
    desc: boolean;
  };
  filter?: {
    created_at?: number[];
  };
};

export async function getNotifications({ supabase, params }: { supabase: Client; params: GetNotificationsParams }) {
  return await unstable_cache(
    async () => {
      const { orgId, sort, filter, page = 1, perPage = 10 } = params;
      const { created_at } = filter || {};

      const query = supabase
        .from("product_restock_notifications")
        .select("*, product:products(id, name, image, inventory_quantity)", { count: "exact" })
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

      const from = (page - 1) * perPage;
      const to = page * perPage - 1;
      const { data, count } = await query.range(from, to);

      return { data, count: count ?? 0, params };
    },
    [JSON.stringify(params)],
    {
      revalidate: 1,
      tags: ["notifications"],
    },
  )();
}
