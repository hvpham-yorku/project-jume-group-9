"use server";

import { addActivityLog } from "@/app/actions";
import { createClient } from "@/utils/supabase/client/server";
import { Database } from "@/utils/supabase/types";
import { revalidateTag, unstable_noStore } from "next/cache";

/* -------------------------------------------------------------------------- */
/*                               deleteCustomers                              */
/* -------------------------------------------------------------------------- */
interface DeleteCustomersProps {
  orgId: string;
  customerIds: string[];
}
export const deleteCustomers = async ({ orgId, customerIds }: DeleteCustomersProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customers")
    .delete()
    .in("id", customerIds)
    .eq("org_id", orgId)
    .select("*")
    .throwOnError();

  revalidateTag("customers");

  await addActivityLog({
    orgId: orgId,
    action: "Customers: Delete",
    description: `Customers deleted. List of customers: ${customers.map((customer) => customer.name).join(", ")}`,
  });

  return customers;
};

/* -------------------------------------------------------------------------- */
/*                               createCustomer                               */
/* -------------------------------------------------------------------------- */
interface CreateCustomerProps {
  orgId: string;
  customer: Database["public"]["Tables"]["customers"]["Insert"];
}
export const createCustomer = async ({ orgId, customer }: CreateCustomerProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: createdCustomer } = await supabase
    .from("customers")
    .insert(customer)
    .select("*")
    .single()
    .throwOnError();

  revalidateTag("customers");

  await addActivityLog({
    orgId: orgId,
    action: "Customer: Create",
    description: `Customer "${createdCustomer.name}" has been created.`,
  });

  return createdCustomer;
};

/* -------------------------------------------------------------------------- */
/*                               updateCustomer                               */
/* -------------------------------------------------------------------------- */
interface UpdateCustomerProps {
  orgId: string;
  customerId: string;
  customer: Database["public"]["Tables"]["customers"]["Update"];
}
export const updateCustomer = async ({ orgId, customerId, customer }: UpdateCustomerProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: updatedCustomer } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", customerId)
    .eq("org_id", orgId)
    .select("*")
    .single()
    .throwOnError();

  revalidateTag("customers");

  await addActivityLog({
    orgId: orgId,
    action: "Customer: Update",
    description: `Customer "${updatedCustomer.name}" has been updated.`,
  });

  return updatedCustomer;
};
