import { UTCDate } from "@date-fns/utc";
import { Client } from "@/utils/supabase/types";
import { unstable_cache } from "@/lib/unstable-cache";

export type GetActivitiesParams = {
  orgId: string;
  page: number;
  perPage: number;
  sort: {
    id: string;
    desc: boolean;
  };
  filter?: {
    q?: string | null;
    created_at?: number[];
  };
};

export async function getActivities({ supabase, params }: { supabase: Client; params: GetActivitiesParams }) {
  return await unstable_cache(
    async () => {
      const { orgId, sort, filter, page = 1, perPage = 10 } = params;
      const { q, created_at } = filter || {};

      const query = supabase
        .from("activity_logs")
        .select("*, user:users(id, full_name, email, avatar_url)", { count: "exact" })
        .eq("org_id", orgId)
        .throwOnError();

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
      if (q) {
        query.or(`action.ilike.%${q}%,description.ilike.%${q}%`);
      }

      const from = (page - 1) * perPage;
      const to = page * perPage - 1;
      const { data, count } = await query.range(from, to);

      return { data, count: count ?? 0, params };
    },
    [JSON.stringify(params)],
    {
      revalidate: 1,
      tags: ["activities"],
    },
  )();
}
