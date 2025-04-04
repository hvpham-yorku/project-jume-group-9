import React, { Suspense } from "react";
import { Metadata } from "next";

import { getNotifications } from "./_data";

import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";
import { getSortingStateParser } from "@/lib/parsers";
import { createClient } from "@/utils/supabase/client/server";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { NotificationsTable } from "./_components/notifications-table";
import { type SearchParams } from "nuqs/server";
import { getOrgMember } from "@/app/data";
import { redirect } from "next/navigation";
import { isPrivileged } from "@/lib/utils";

type Notification = Awaited<ReturnType<typeof getNotifications>>["data"][number];

export const metadata: Metadata = {
  title: "Product Restock Notifications",
  description: "Product Restock Notifications",
};

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Notification>().withDefault([{ id: "created_at", desc: true }]),
  created_at: parseAsArrayOf(z.coerce.number()).withDefault([]),
});

interface CustomersPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ orgId: string }>;
}
export default async function CustomersPage({ params, searchParams }: CustomersPageProps) {
  const { orgId } = await params;
  const { page, perPage, sort, created_at } = await searchParamsCache.parse(searchParams);

  const orgMember = await getOrgMember({ orgId });
  if (!isPrivileged(orgMember.role)) {
    redirect(`/orgs/${orgId}`);
  }

  const supabase = await createClient();

  const promises = Promise.all([
    getNotifications({
      supabase,
      params: {
        orgId,
        page,
        perPage,
        sort: sort[0],
        filter: {
          created_at,
        },
      },
    }),
  ]);

  return (
    <div className="grid p-8 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">Product Restock Notifications</h1>
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
        <NotificationsTable promises={promises} />
      </Suspense>
    </div>
  );
}
