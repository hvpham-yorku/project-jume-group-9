import { CreateCustomerForm } from "../_components/create-customer-form";
import { Metadata } from "next";
import { getOrgMember } from "@/app/data";
import { redirect } from "next/navigation";
import { isPrivileged } from "@/lib/utils";

interface CreateCustomerPageProps {
  params: Promise<{ orgId: string }>;
}

export const metadata: Metadata = {
  title: "Create Customer",
  description: "Create a new customer",
};

export default async function CreateCustomerPage(props: CreateCustomerPageProps) {
  const { orgId } = await props.params;

  const orgMember = await getOrgMember({ orgId });
  if (!isPrivileged(orgMember.role)) {
    redirect(`/orgs/${orgId}/customers`);
  }

  return <CreateCustomerForm />;
}
