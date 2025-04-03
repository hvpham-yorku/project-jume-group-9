import { createClient } from "@/utils/supabase/client/server";
import { getProduct } from "../_data";
import { UpdateProductForm } from "../_components/update-product-form";
import { getOrgMember } from "@/app/data";
import { redirect } from "next/navigation";
import { isPrivileged } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ orgId: string; productId: string }>;
}
export default async function ProductPage({ params }: ProductPageProps) {
  const { orgId, productId } = await params;

  const orgMember = await getOrgMember({ orgId });
  if (!isPrivileged(orgMember.role)) {
    redirect(`/orgs/${orgId}/products`);
  }

  const supabase = await createClient();
  const { data: product } = await getProduct({ supabase, orgId, productId });

  return <UpdateProductForm product={product} />;
}
