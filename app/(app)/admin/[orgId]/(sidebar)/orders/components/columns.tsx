"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "./data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { getOrders } from "@/utils/supabase/queries/normal-queries";

type Order = NonNullable<Awaited<ReturnType<typeof getOrders>>>[number];

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "product.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
    cell: ({ row }) => {
      const product = row.original.product;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{product.name}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "order_number",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order Number" />,
    cell: ({ row }) => <div className="w-[80px]">#{row.getValue("order_number")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fulfillment_status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue("fulfillment_status"));

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <Badge className={status.className}>{status.label}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "items_count",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("items_count")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "notified",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Notified" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("notified") ? "Yes" : "No"}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("total")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
