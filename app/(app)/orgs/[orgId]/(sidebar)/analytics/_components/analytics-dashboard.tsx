"use client";

import React, { useEffect } from "react";
import {
  ArrowUpRight,
  BlocksIcon,
  CalendarIcon,
  ChevronRight,
  DollarSignIcon,
  ImageIcon,
  PlusIcon,
  Receipt,
  TagIcon,
  TrendingUp,
  TrendingUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client/client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../_data";
import { OrgMember } from "@/types";
import Link from "next/link";
import { cn, initialify, isPrivileged } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaCircle } from "react-icons/fa";
import { subMonths, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
      </div>
    </div>
  );
}

type Product = Awaited<ReturnType<typeof getDashboardData>>["products"][number];
interface ProductsStatusChartProps {
  products: Product[];
  date: DateRange;
}
export function ProductsStatusChart({ products, date }: ProductsStatusChartProps) {
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
    active: {
      label: "Active",
      color: "#4ade80", // Converted from #4ade80
    },
    draft: {
      label: "Draft",
      color: "#67e8f9", // Converted from #67e8f9
    },
    archived: {
      label: "Archived",
      color: "#f97316", // Converted from #f97316
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

            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />

            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

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
