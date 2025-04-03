"use server";

import { addActivityLog } from "@/app/actions";
import { createClient } from "@/utils/supabase/client/server";
import { Database } from "@/utils/supabase/types";
import { revalidateTag, unstable_noStore } from "next/cache";

/* -------------------------------------------------------------------------- */
/*                                 createOrder                                */
/* -------------------------------------------------------------------------- */
interface CreateOrderProps {
  orgId: string;
  order: Database["public"]["Tables"]["orders"]["Insert"];
}
export const createOrder = async ({ orgId, order }: CreateOrderProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: createdOrder } = await supabase.from("orders").insert(order).select("*").single().throwOnError();

  revalidateTag("orders");

  await addActivityLog({
    orgId: orgId,
    action: "Order: Create",
    description: `Order "${createdOrder.order_number}" has been created.`,
  });

  return createdOrder;
};

/* -------------------------------------------------------------------------- */
/*                                 updateOrder                                */
/* -------------------------------------------------------------------------- */
interface UpdateOrderProps {
  orgId: string;
  orderId: string;
  order: Database["public"]["Tables"]["orders"]["Update"];
}
export const updateOrder = async ({ orgId, orderId, order }: UpdateOrderProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: updatedOrder } = await supabase
    .from("orders")
    .update(order)
    .eq("id", orderId)
    .eq("org_id", orgId)
    .select("*")
    .single()
    .throwOnError();

  revalidateTag("orders");

  await addActivityLog({
    orgId: orgId,
    action: "Order: Update",
    description: `Order "${updatedOrder.order_number}" has been updated.`,
  });

  return updatedOrder;
};
