import { createClient } from "@/utils/supabase/client/server";
import { getCustomer } from "../_data";
import { UpdateCustomerForm } from "../_components/update-customer-form";
import { getOrgMember } from "@/app/data";
import { isPrivileged } from "@/lib/utils";
import { redirect } from "next/navigation";

interface CustomerPageProps {
  params: Promise<{ orgId: string; customerId: string }>;
}
export default async function CustomerPage({ params }: CustomerPageProps) {
  const { orgId, customerId } = await params;

  const orgMember = await getOrgMember({ orgId });
  if (!isPrivileged(orgMember.role)) {
    redirect(`/orgs/${orgId}/customers`);
  }

  const supabase = await createClient();
  const { data: customer } = await getCustomer({ supabase, orgId, customerId });

  return <UpdateCustomerForm customer={customer} />;
}
