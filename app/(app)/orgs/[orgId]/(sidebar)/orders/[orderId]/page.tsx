import { createClient } from "@/utils/supabase/client/server";
import { getOrder } from "../_data";
import { UpdateOrderForm } from "../_components/update-order-form";
import { Metadata } from "next";
import { getOrgMember } from "@/app/data";
import { redirect } from "next/navigation";
import { isPrivileged } from "@/lib/utils";

interface UpdateOrderPageProps {
  params: Promise<{ orgId: string; orderId: string }>;
}

export const metadata: Metadata = {
  title: "Update Order",
  description: "Update order details",
};

export default async function UpdateOrderPage(props: UpdateOrderPageProps) {
  const { orgId, orderId } = await props.params;

  const orgMember = await getOrgMember({ orgId });
  if (!isPrivileged(orgMember.role)) {
    redirect(`/orgs/${orgId}/orders`);
  }

  const supabase = await createClient();
  const { data: order } = await getOrder({ supabase, orgId, orderId });

  return <UpdateOrderForm order={order} />;
}
