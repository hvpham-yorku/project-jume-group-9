import React, { Suspense } from "react";
import { Metadata } from "next";

import { getActivities } from "./_data";

import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";
import { getSortingStateParser } from "@/lib/parsers";
import { createClient } from "@/utils/supabase/client/server";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { ActivitiesTable } from "./_components/activities-table";
import { type SearchParams } from "nuqs/server";

type Activity = Awaited<ReturnType<typeof getActivities>>["data"][number];

export const metadata: Metadata = {
  title: "Activities",
  description: "Organization Activities",
};

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Activity>().withDefault([{ id: "created_at", desc: true }]),
  q: parseAsString,
  created_at: parseAsArrayOf(z.coerce.number()).withDefault([]),
});

interface CustomersPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ orgId: string }>;
}
export default async function CustomersPage({ params, searchParams }: CustomersPageProps) {
  const { orgId } = await params;
  const { page, perPage, sort, q, created_at } = await searchParamsCache.parse(searchParams);

  const supabase = await createClient();

  const promises = Promise.all([
    getActivities({
      supabase,
      params: {
        orgId,
        page,
        perPage,
        sort: sort[0],
        filter: {
          q,
          created_at,
        },
      },
    }),
  ]);

  return (
    <div className="grid p-8 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">Activities</h1>
      </div>
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            filterCount={2}
            cellWidths={["10rem", "30rem", "10rem", "10rem", "6rem", "6rem"]}
            shrinkZero
          />
        }
      >
        <ActivitiesTable promises={promises} />
      </Suspense>
    </div>
  );
}
