import { createClient } from "@/utils/supabase/client/server";
import { getProduct } from "../_data";
import { CreateOrderForm } from "../_components/create-order-form";
import { Metadata } from "next";
import { isPrivileged } from "@/lib/utils";
import { getOrgMember } from "@/app/data";
import { redirect } from "next/navigation";

type Product = Awaited<ReturnType<typeof getProduct>>["data"];

interface CreateOrderPageProps {
  searchParams: Promise<{
    product?: string;
  }>;
  params: Promise<{ orgId: string }>;
}

export const metadata: Metadata = {
  title: "Create Order",
  description: "Create a new order",
};

export default async function CreateOrderPage(props: CreateOrderPageProps) {
  const { orgId } = await props.params;
  const searchParams = await props.searchParams;

  const orgMember = await getOrgMember({ orgId });
  if (!isPrivileged(orgMember.role)) {
    redirect(`/orgs/${orgId}/orders`);
  }

  let product: Product | undefined;
  if (searchParams.product) {
    const supabase = await createClient();
    const { data: productData } = await getProduct({ supabase, orgId, productId: searchParams.product });
    product = productData;
  }

  console.log({ product });

  return <CreateOrderForm product={product} />;
}
