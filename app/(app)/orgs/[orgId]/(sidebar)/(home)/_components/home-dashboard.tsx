"use client";

import React from "react";
import {
  ArrowUpRight,
  BlocksIcon,
  Box,
  ChevronRight,
  DollarSignIcon,
  ImageIcon,
  PlusIcon,
  Receipt,
  TagIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client/client";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs, getDashboardData, getNotifications } from "../_data";
import { OrgMember } from "@/types";
import Link from "next/link";
import { initialify, isPrivileged } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaCircle } from "react-icons/fa";
interface HomeDashboardProps {
  orgId: string;
  orgMember: OrgMember;
  initialData: Awaited<ReturnType<typeof getDashboardData>>;
}
export default function HomeDashboard({ orgId, orgMember, initialData }: HomeDashboardProps) {
  const supabase = createClient();
  const { user, role } = orgMember;

  const {
    data: { notifications, activityLogs, totalProducts, totalInventory, totalPrice, totalOrders, orders, products },
    isPending,
    error,
  } = useQuery({
    queryKey: ["home-dashboard", orgId],
    queryFn: () => getDashboardData({ supabase, orgId }),
    initialData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return (
    <div className="grid p-8 gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-medium tracking-tight">Welcome, {user.full_name}!</h1>
          <Badge variant="secondary" className="uppercase text-xs text-muted-foreground">
            {role}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* ----------------------------- Total Inventory ---------------------------- */}
        <Card>
          <CardHeader className="relative">
            <CardDescription>Total Inventory</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{totalInventory}</CardTitle>
            <div className="absolute right-4 top-4">
              <BlocksIcon className="size-4" />
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up <TrendingUpIcon className="size-4" />
            </div>
          </CardFooter>
        </Card>
        {/* ----------------------------- Total Inventory Value ---------------------------- */}
        <Card>
          <CardHeader className="relative">
            <CardDescription>Total Inventory Value</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{totalPrice}</CardTitle>
            <div className="absolute right-4 top-4">
              <DollarSignIcon className="size-4" />
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up <TrendingUpIcon className="size-4" />
            </div>
          </CardFooter>
        </Card>
        {/* ----------------------------- Total Products ---------------------------- */}
        <Card>
          <CardHeader className="relative">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{totalProducts}</CardTitle>
            <div className="absolute right-4 top-4">
              <TagIcon className="size-4" />
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up <TrendingUpIcon className="size-4" />
            </div>
          </CardFooter>
        </Card>
        {/* ----------------------------- Total Orders ---------------------------- */}
        <Card>
          <CardHeader className="relative">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{totalOrders}</CardTitle>
            <div className="absolute right-4 top-4">
              <Receipt className="size-4" />
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up <TrendingUpIcon className="size-4" />
            </div>
          </CardFooter>
        </Card>
      </div>

      <Separator />

      {isPrivileged(role) && (
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <NotificationsTable data={notifications} orgId={orgId} />
          <ActivityLogsTable data={activityLogs} orgId={orgId} />
        </div>
      )}

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <OrdersTable data={orders} orgId={orgId} />
        <ProductsTable data={products} orgId={orgId} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             NotificationsTable                             */
/* -------------------------------------------------------------------------- */
type Notification = Awaited<ReturnType<typeof getDashboardData>>["notifications"][number];
function NotificationsTable({ data: notifications, orgId }: { data: Notification[]; orgId: string }) {
  const supabase = createClient();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Restock Notifications</CardTitle>
          <CardDescription>Restock notifications from your warehouse.</CardDescription>
        </div>
        <Button className="ml-auto" asChild>
          <Link href={`/orgs/${orgId}/notifications`}>
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Product</TableHead>
                <TableHead className="whitespace-nowrap">Inventory Quantity</TableHead>
                <TableHead className="whitespace-nowrap">Restock Threshold</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.length > 0 ? (
                notifications?.map((notification) => {
                  const product = notification.product;
                  const image = product.image
                    ? supabase.storage.from("media").getPublicUrl(product.image).data.publicUrl
                    : null;

                  return (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="size-10 rounded overflow-hidden bg-white text-muted-foreground p-1 border">
                            <div className="relative size-full flex items-center justify-center">
                              {image ? (
                                <Image
                                  src={`${image}?width=100&height=100`}
                                  alt={product.name}
                                  fill
                                  unoptimized
                                  className="object-contain"
                                />
                              ) : (
                                <ImageIcon className="size-4" />
                              )}
                            </div>
                          </div>
                          <Button variant="link" size="sm" asChild>
                            <Link href={`/orgs/${orgId}/products/${product.id}`}>{product.name}</Link>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{product.inventory_quantity}</TableCell>
                      <TableCell>{product.restock_threshold}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" asChild>
                            <Link href={`/orgs/${orgId}/orders/new?product=${notification.product.id}`}>
                              Create Order
                              <PlusIcon className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No Restock Notifications Yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                             ActivityLogsTable                             */
/* -------------------------------------------------------------------------- */
type ActivityLog = Awaited<ReturnType<typeof getDashboardData>>["activityLogs"][number];
function ActivityLogsTable({ data: activityLogs, orgId }: { data: ActivityLog[]; orgId: string }) {
  const supabase = createClient();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>Activity logs from your warehouse.</CardDescription>
        </div>
        <Button className="ml-auto" asChild>
          <Link href={`/orgs/${orgId}/activities`}>
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">User</TableHead>
                <TableHead className="whitespace-nowrap">Action</TableHead>
                <TableHead className="whitespace-nowrap">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.length > 0 ? (
                activityLogs?.map((activityLog) => {
                  const { full_name, avatar_url } = activityLog.user;
                  const initials = initialify(full_name);
                  const userImage = avatar_url
                    ? avatar_url.startsWith("http")
                      ? avatar_url
                      : supabase.storage.from("media").getPublicUrl(avatar_url).data.publicUrl
                    : null;

                  return (
                    <TableRow key={activityLog.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 rounded-sm">
                            {userImage && <AvatarImage src={userImage} alt={full_name} />}
                            <AvatarFallback className="rounded-sm">{initials}</AvatarFallback>
                          </Avatar>
                          <span className="whitespace-nowrap">{full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="whitespace-nowrap uppercase">{activityLog.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[300px] text-left truncate">{activityLog.description}</p>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No Activity Logs Yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                             OrdersTable                             */
/* -------------------------------------------------------------------------- */
type Order = Awaited<ReturnType<typeof getDashboardData>>["orders"][number];
function OrdersTable({ data: orders, orgId }: { data: Order[]; orgId: string }) {
  const supabase = createClient();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Recent orders from your warehouse.</CardDescription>
        </div>
        <Button className="ml-auto" asChild>
          <Link href={`/orgs/${orgId}/orders`}>
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Order</TableHead>
                <TableHead className="whitespace-nowrap">Product</TableHead>
                <TableHead className="whitespace-nowrap">Fulfillment Status</TableHead>
                <TableHead className="whitespace-nowrap">Quantity</TableHead>
                <TableHead className="whitespace-nowrap text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders?.map((order) => {
                  const product = order.product;
                  const productImage = product.image
                    ? supabase.storage.from("media").getPublicUrl(product.image).data.publicUrl
                    : null;
                  const status = order.fulfillment_status;

                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Button variant="link" size="sm" asChild>
                          <Link href={`/orgs/${orgId}/orders/${order.id}`}>
                            #{order.order_number}
                            <ChevronRight className="size-4" />
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="size-10 rounded overflow-hidden bg-white text-muted-foreground p-1 border">
                            <div className="relative size-full flex items-center justify-center">
                              {productImage ? (
                                <Image
                                  src={`${productImage}?width=100&height=100`}
                                  alt={product.name}
                                  fill
                                  unoptimized
                                  className="object-contain"
                                />
                              ) : (
                                <ImageIcon className="size-4" />
                              )}
                            </div>
                          </div>
                          <Button variant="link" size="sm" asChild>
                            <Link href={`/orgs/${orgId}/products/${product.id}`}>{product.name}</Link>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge className="text-2xs capitalize" variant="outline">
                            <FaCircle
                              className={`size-[1em] mr-2 ${status === "fulfilled" ? "text-green-400" : status === "pending" ? "text-yellow-500" : "text-red-500"}`}
                            />
                            {status}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center">
                          <span>${order.total}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-right justify-end">
                          <span>{order.quantity}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No Orders Yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                             ProductsTable                             */
/* -------------------------------------------------------------------------- */
type Product = Awaited<ReturnType<typeof getDashboardData>>["products"][number];
function ProductsTable({ data: products, orgId }: { data: Product[]; orgId: string }) {
  const supabase = createClient();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Recent products from your warehouse.</CardDescription>
        </div>
        <Button className="ml-auto" asChild>
          <Link href={`/orgs/${orgId}/products`}>
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Product</TableHead>
                <TableHead className="whitespace-nowrap">Category</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Price</TableHead>
                <TableHead className="whitespace-nowrap text-right">Inventory Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products?.map((product) => {
                  const productImage = product.image
                    ? supabase.storage.from("media").getPublicUrl(product.image).data.publicUrl
                    : null;
                  const status = product.status;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="size-10 rounded overflow-hidden bg-white text-muted-foreground p-1 border">
                            <div className="relative size-full flex items-center justify-center">
                              {productImage ? (
                                <Image
                                  src={`${productImage}?width=100&height=100`}
                                  alt={product.name}
                                  fill
                                  unoptimized
                                  className="object-contain"
                                />
                              ) : (
                                <ImageIcon className="size-4" />
                              )}
                            </div>
                          </div>
                          <Button variant="link" size="sm" asChild>
                            <Link href={`/orgs/${orgId}/products/${product.id}`}>{product.name}</Link>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>{product.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge className="text-2xs capitalize" variant="outline">
                            <FaCircle
                              className={`size-[1em] mr-2 ${status === "active" ? "text-green-400" : status === "draft" ? "text-cyan-300" : "text-orange-500"}`}
                            />
                            {status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>${product.price}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-right justify-end">
                          <span>{product.inventory_quantity}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No Products Yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
