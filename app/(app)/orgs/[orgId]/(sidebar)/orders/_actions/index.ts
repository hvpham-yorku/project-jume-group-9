"use server";

import { addActivityLog } from "@/app/actions";
import { createClient } from "@/utils/supabase/client/server";
import { Database } from "@/utils/supabase/types";
import { revalidateTag, unstable_noStore } from "next/cache";

/* -------------------------------------------------------------------------- */
/*                        updateOrdersFulfillmentStatus                       */
/* -------------------------------------------------------------------------- */
interface UpdateOrdersFulfillmentStatusProps {
  orgId: string;
  orderIds: string[];
  fulfillment_status: Database["public"]["Enums"]["fulfillment_status"];
}
export const updateOrdersFulfillmentStatus = async ({
  orgId,
  orderIds,
  fulfillment_status,
}: UpdateOrdersFulfillmentStatusProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .update({ fulfillment_status })
    .in("id", orderIds)
    .eq("org_id", orgId)
    .select("*")
    .throwOnError();

  revalidateTag("orders");

  await addActivityLog({
    orgId: orgId,
    action: `Orders: Update Fulfillment Status To ${fulfillment_status.toUpperCase()}`,
    description: `Order fulfillment status updated to ${fulfillment_status} for ${orders.length} orders. List of orders: ${orders.map((order) => order.order_number).join(", ")}`,
  });

  return orders;
};

/* -------------------------------------------------------------------------- */
/*                                deleteOrders                                */
/* -------------------------------------------------------------------------- */
interface DeleteOrdersProps {
  orgId: string;
  orderIds: string[];
}
export const deleteOrders = async ({ orgId, orderIds }: DeleteOrdersProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .delete()
    .in("id", orderIds)
    .eq("org_id", orgId)
    .select("*")
    .throwOnError();

  revalidateTag("orders");

  await addActivityLog({
    orgId: orgId,
    action: "Orders: Delete",
    description: `Orders deleted. List of orders: ${orders.map((order) => order.order_number).join(", ")}`,
  });

  return orders;
};

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
