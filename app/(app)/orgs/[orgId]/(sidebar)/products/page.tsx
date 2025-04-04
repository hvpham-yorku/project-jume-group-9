import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { Suspense } from "react";
import { Metadata } from "next";

import {
  getProducts,
  getProductsPriceRange,
  getProductsInventoryQuantityRange,
  getProduct,
  getProductsCategories,
} from "./_data";
import Link from "next/link";

import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";
import { getSortingStateParser } from "@/lib/parsers";
import { Database } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/client/server";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { ProductsTable } from "./_components/products-table";
import { type SearchParams } from "nuqs/server";
import { getOrgMember } from "@/app/data";
import { isPrivileged } from "@/lib/utils";

type Product = Awaited<ReturnType<typeof getProduct>>["data"];

export const metadata: Metadata = {
  title: "Products",
  description: "Your products",
};

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Product>().withDefault([{ id: "created_at", desc: true }]),
  name: parseAsString,
  category: parseAsArrayOf(parseAsString).withDefault([]),
  status: parseAsArrayOf(
    z.enum(["active", "draft", "archived"] satisfies z.EnumValues<Database["public"]["Enums"]["product_status"]>),
  ).withDefault([]),
  price: parseAsArrayOf(z.coerce.number()).withDefault([]),
  inventory_quantity: parseAsArrayOf(z.coerce.number()).withDefault([]),
  customer: parseAsArrayOf(z.string()).withDefault([]),
  created_at: parseAsArrayOf(z.coerce.number()).withDefault([]),
});

interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ orgId: string }>;
}
export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { orgId } = await params;
  const { page, perPage, sort, name, category, status, price, inventory_quantity, customer, created_at } =
    await searchParamsCache.parse(searchParams);

  const supabase = await createClient();

  const orgMember = await getOrgMember({ orgId });

  const promises = Promise.all([
    getProducts({
      supabase,
      params: {
        orgId,
        page,
        perPage,
        sort: sort[0],
        filter: {
          name,
          category,
          status,
          price,
          inventory_quantity,
          customer,
          created_at,
        },
      },
    }),
    getProductsPriceRange({ supabase, orgId }),
    getProductsInventoryQuantityRange({ supabase, orgId }),
    getProductsCategories({ supabase, orgId }),
  ]);

  return (
    <div className="grid p-8 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">Products</h1>
        {isPrivileged(orgMember.role) && (
          <Button asChild size="sm">
            <Link href={`/orgs/${orgId}/products/new`} prefetch>
              Create Product <PlusIcon />
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
        <ProductsTable orgMember={orgMember} promises={promises} />
      </Suspense>
    </div>
  );
}
