import React from "react";
import { getUser } from "@/utils/supabase/queries/cached-queries";
import { getOrders, getProductRestockNotifications, getProducts } from "@/utils/supabase/queries/normal-queries";
import { Arro, ArrowUpRight, Badge, CardContentwUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import PieChartComponent from "@/components/ui/PieChartComponent";

interface HomePageProps {
  params: {
    orgId: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { orgId } = await params;
  const user = await getUser();
  const notifications = await getProductRestockNotifications({ orgId });
  const orders = await getOrders({ orgId });
  const products = await getProducts({ orgId });

  //   const orderPieData = orders?.map((order) => ({
  //     name: order.order_number,
  //     value: order.items_count < 10 ? 1 : 0,
  //   }));

  const stockSummary = {
    lowStockItems: 5,
    totalItems: 50,
    activeItems: 45,
  };

  const orderPieData = [
    { name: "Low Stock", value: stockSummary.lowStockItems },
    { name: "Active", value: stockSummary.activeItems },
  ];

  return (
    <div className="w-full p-10">
      <h2 className="text-4xl mb-8">Welcome, Max Jam!</h2>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Restock notifications from your warehouse.</CardDescription>
            </div>
            <Button className="ml-auto gap-1">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications?.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="font-medium">{notification.product.name}</div>
                    </TableCell>
                    <TableCell className="text-right">{notification.product.inventory_quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Recent orders from your warehouse.</CardDescription>
            </div>
            <Button className="ml-auto gap-1">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.order_number}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.created_at}</TableCell>
                    <TableCell className="text-right">{order.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <PieChartComponent data={orderPieData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
