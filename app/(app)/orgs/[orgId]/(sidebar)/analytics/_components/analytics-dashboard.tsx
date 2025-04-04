"use client";

import React from "react";
import { BlocksIcon, CalendarIcon, DollarSignIcon, Receipt, TagIcon, TrendingUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client/client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../_data";
import { OrgMember } from "@/types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { subMonths, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Label } from "recharts";

interface AnalyticsDashboardProps {
  orgId: string;
  orgMember: OrgMember;
  initialData: Awaited<ReturnType<typeof getDashboardData>>;
}
export default function AnalyticsDashboard({ orgId, orgMember, initialData }: AnalyticsDashboardProps) {
  const supabase = createClient();
  const { user, role } = orgMember;

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["analytics-dashboard", orgId, date?.from?.toISOString(), date?.to?.toISOString()],
    queryFn: () => getDashboardData({ supabase, orgId, date }),
    refetchOnWindowFocus: true,
  });

  const data = dashboardData ? dashboardData : isLoading ? null : initialData;

  return (
    <div className="grid p-8 gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-medium tracking-tight">Analytics</h1>
        </div>

        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn("w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* ----------------------------- Total Inventory ---------------------------- */}
        <Card>
          <CardHeader className="relative">
            <CardDescription>Total Inventory</CardDescription>
            <CardTitle className="text-2xl font-semibold leading-[100%] tabular-nums">
              {isLoading || !data ? (
                <div className="animate-pulse h-[1em] w-[4em] rounded bg-muted"></div>
              ) : (
                data.totalInventory
              )}
            </CardTitle>
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
            <CardTitle className="text-2xl font-semibold leading-[100%] tabular-nums">
              {isLoading || !data ? (
                <div className="animate-pulse h-[1em] w-[4em] rounded bg-muted"></div>
              ) : (
                data.totalPrice
              )}
            </CardTitle>
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
            <CardTitle className="text-2xl font-semibold leading-[100%] tabular-nums">
              {isLoading || !data ? (
                <div className="animate-pulse h-[1em] w-[4em] rounded bg-muted"></div>
              ) : (
                data.totalProducts
              )}
            </CardTitle>
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
            <CardTitle className="text-2xl font-semibold leading-[100%] tabular-nums">
              {isLoading || !data ? (
                <div className="animate-pulse h-[1em] w-[4em] rounded bg-muted"></div>
              ) : (
                data.totalOrders
              )}
            </CardTitle>
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

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <ProductsStatusChart products={data?.products ?? []} />
        <OrdersChart orders={data?.orders ?? []} />
      </div>

      <CustomerInventoryChart products={data?.products ?? []} />
    </div>
  );
}

type Order = Awaited<ReturnType<typeof getDashboardData>>["orders"][number];
export function OrdersChart({ orders }: { orders: Order[] }) {
  // Group products by status and count them
  const statusCounts = orders.reduce(
    (acc, order) => {
      const status = order.fulfillment_status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = [
    { status: "Fulfilled", count: statusCounts.fulfilled || 0, fill: "var(--color-fulfilled)" },
    { status: "Pending", count: statusCounts.pending || 0, fill: "var(--color-pending)" },
    { status: "Cancelled", count: statusCounts.cancelled || 0, fill: "var(--color-cancelled)" },
  ];

  const chartConfig = {
    count: {
      label: "Orders",
    },
    fulfilled: {
      label: "Fulfilled",
      color: "#4ade80",
    },
    pending: {
      label: "Pending",
      color: "#eab308",
    },
    cancelled: {
      label: "Cancelled",
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Fulfillment Status</CardTitle>
        <CardDescription>Distribution of order fulfillment statuses across your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5} fill="#8884d8">
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {orders.length.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Orders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

type Product = Awaited<ReturnType<typeof getDashboardData>>["products"][number];
export function ProductsStatusChart({ products }: { products: Product[] }) {
  // Group products by status and count them
  const statusCounts = products.reduce(
    (acc, product) => {
      const status = product.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = [
    { status: "Active", count: statusCounts.active || 0, fill: "var(--color-active)" },
    { status: "Draft", count: statusCounts.draft || 0, fill: "var(--color-draft)" },
    { status: "Archived", count: statusCounts.archived || 0, fill: "var(--color-archived)" },
  ];

  const chartConfig = {
    count: {
      label: "Quantity",
    },
    active: {
      label: "Active",
      color: "#4ade80",
    },
    draft: {
      label: "Draft",
      color: "#67e8f9",
    },
    archived: {
      label: "Archived",
      color: "#f97316",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products Status</CardTitle>
        <CardDescription>Distribution of product statuses across your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <CartesianGrid horizontal={false} />

            <YAxis dataKey="status" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
            <XAxis dataKey="count" type="number" hide />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar dataKey="count" radius={4} fill="var(--color-status)" barSize={40}>
              <LabelList
                dataKey="status"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList dataKey="count" position="right" offset={8} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function CustomerInventoryChart({ products }: { products: Product[] }) {
  // Group products by customer and count inventory
  const customerInventory = products.reduce(
    (acc, product) => {
      const customer = product.customer;
      const customerId = customer.id || "unknown";
      const customerName = customer.name || "Unknown Customer";

      if (!acc[customerId]) {
        acc[customerId] = {
          customerId,
          customerName,
          count: 0,
        };
      }

      // Add product quantity to customer's total
      acc[customerId].count += product.inventory_quantity || 0;
      return acc;
    },
    {} as Record<string, { customerId: string; customerName: string; count: number }>,
  );

  // Convert to array and sort by count (descending)
  const chartData = Object.values(customerInventory)
    .sort((a, b) => b.count - a.count)
    .map((item) => ({
      customer: item.customerName,
      count: item.count,
      fill: "var(--color-customer)",
    }));

  const chartConfig = {
    count: {
      label: "Inventory",
    },
    customer: {
      label: "Customer",
      color: "#414143",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Inventory Distribution</CardTitle>
        <CardDescription>Total inventory held by each customer</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid horizontal={false} />

            <YAxis dataKey="count" type="number" hide />

            <XAxis dataKey="customer" tickLine={false} tickMargin={10} axisLine={false} tick={{ fontSize: 12 }} />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar dataKey="count" radius={4} fill="var(--color-customer)">
              <LabelList dataKey="count" position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
