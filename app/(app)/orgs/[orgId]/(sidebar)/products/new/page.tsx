import { CreateProductForm } from "../_components/create-product-form";
import { Metadata } from "next";
import { getOrgMember } from "@/app/data";
import { redirect } from "next/navigation";
import { isPrivileged } from "@/lib/utils";

interface CreateProductPageProps {
  params: Promise<{ orgId: string }>;
}

export const metadata: Metadata = {
  title: "Create Product",
  description: "Create a new product",
};

export default async function CreateProductPage(props: CreateProductPageProps) {
  const { orgId } = await props.params;

  const orgMember = await getOrgMember({ orgId });
  if (!isPrivileged(orgMember.role)) {
    redirect(`/orgs/${orgId}/products`);
  }

  return <CreateProductForm />;
}
