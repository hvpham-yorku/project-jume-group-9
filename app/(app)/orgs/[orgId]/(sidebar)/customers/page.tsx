import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { Suspense } from "react";
import { Metadata } from "next";

import { getCustomers, getCustomerCities, getCustomer } from "./_data";
import Link from "next/link";

import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";
import { getSortingStateParser } from "@/lib/parsers";
import { createClient } from "@/utils/supabase/client/server";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { CustomersTable } from "./_components/customers-table";
import { type SearchParams } from "nuqs/server";
import { getOrgMember } from "@/app/data";
import { isPrivileged } from "@/lib/utils";

type Customer = Awaited<ReturnType<typeof getCustomer>>["data"];

export const metadata: Metadata = {
  title: "Customers",
  description: "Your customers",
};

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Customer>().withDefault([{ id: "created_at", desc: true }]),
  name: parseAsString,
  city: parseAsArrayOf(parseAsString).withDefault([]),
  created_at: parseAsArrayOf(z.coerce.number()).withDefault([]),
});

interface CustomersPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ orgId: string }>;
}
export default async function CustomersPage({ params, searchParams }: CustomersPageProps) {
  const { orgId } = await params;
  const { page, perPage, sort, name, city, created_at } = await searchParamsCache.parse(searchParams);

  const supabase = await createClient();

  const orgMember = await getOrgMember({ orgId });

  const promises = Promise.all([
    getCustomers({
      supabase,
      params: {
        orgId,
        page,
        perPage,
        sort: sort[0],
        filter: {
          name,
          city,
          created_at,
        },
      },
    }),
    getCustomerCities({ supabase, orgId }),
  ]);

  return (
    <div className="grid p-8 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">Customers</h1>
        {isPrivileged(orgMember.role) && (
          <Button asChild size="sm">
            <Link href={`/orgs/${orgId}/customers/new`} prefetch>
              Create Customer <PlusIcon />
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
        <CustomersTable orgMember={orgMember} promises={promises} />
      </Suspense>
    </div>
  );
}
