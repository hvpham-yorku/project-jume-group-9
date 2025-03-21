import { Button } from "@/components/ui/button";
import { Link, PlusIcon } from "lucide-react";
import React from "react";
import { DataTable } from "./components/data-table";
import { Metadata } from "next";

import { columns } from "./components/columns";
import { getOrders } from "@/utils/supabase/queries/normal-queries";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your orders",
};

interface OrdersPageProps {
  params: {
    orgId: string;
  };
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { orgId } = params;
  const orders = await getOrders({ orgId });
  console.log({ orders: JSON.stringify(orders, null, 2) });

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <p className="text-2xl font-medium tracking-tight">Orders</p>
        <a href={`/admin/${orgId}/orders/new`}>
          <Button>
            <span>Create Order</span>
            <PlusIcon />
          </Button>
        </a>
      </div>
      <DataTable data={orders} columns={columns} />
    </div>
  );
}
