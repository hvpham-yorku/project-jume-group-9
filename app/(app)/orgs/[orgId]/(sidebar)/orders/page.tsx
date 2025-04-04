import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { Suspense } from "react";
import { Metadata } from "next";

import { getOrders, getOrdersQuantityRange, getOrdersTotalRange } from "./_data";
import Link from "next/link";

import { createSearchParamsCache, parseAsArrayOf, parseAsInteger } from "nuqs/server";
import * as z from "zod";
import { getSortingStateParser } from "@/lib/parsers";
import { Database } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/client/server";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { OrdersTable } from "./_components/orders-table";
import { type SearchParams } from "nuqs/server";
import { getOrgMember } from "@/app/data";
import { isPrivileged } from "@/lib/utils";

type Order = Awaited<ReturnType<typeof getOrders>>["data"][number];

export const metadata: Metadata = {
  title: "Orders",
  description: "Your orders",
};

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Order>().withDefault([{ id: "created_at", desc: true }]),
  order_number: parseAsInteger,
  total: parseAsArrayOf(z.coerce.number()).withDefault([]),
  quantity: parseAsArrayOf(z.coerce.number()).withDefault([]),
  fulfillment_status: parseAsArrayOf(
    z.enum(["pending", "fulfilled", "cancelled"] satisfies z.EnumValues<
      Database["public"]["Enums"]["fulfillment_status"]
    >),
  ).withDefault([]),
  created_at: parseAsArrayOf(z.coerce.number()).withDefault([]),
});

interface OrdersPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ orgId: string }>;
}
export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  const { orgId } = await params;
  const { page, perPage, sort, order_number, total, fulfillment_status, created_at, quantity } =
    await searchParamsCache.parse(searchParams);

  const supabase = await createClient();

  const orgMember = await getOrgMember({ orgId });

  const promises = Promise.all([
    getOrders({
      supabase,
      params: {
        orgId,
        page,
        perPage,
        sort: sort[0],
        filter: {
          fulfillment_status,
          created_at,
          order_number: order_number ?? undefined,
          total,
          quantity,
        },
      },
    }),
    getOrdersTotalRange({ supabase, orgId }),
    getOrdersQuantityRange({ supabase, orgId }),
  ]);

  return (
    <div className="grid p-8 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">Orders</h1>
        {isPrivileged(orgMember.role) && (
          <Button asChild size="sm">
            <Link href={`/orgs/${orgId}/orders/new`} prefetch>
              Create Order <PlusIcon />
            </Link>
          </Button>
        )}
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
        <OrdersTable orgMember={orgMember} promises={promises} />
      </Suspense>
    </div>
  );
}
