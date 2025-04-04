"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataTable } from "@/hooks/use-data-table";
import { createClient } from "@/utils/supabase/client/client";
import { Calendar, ChevronRight, DollarSign, Text, Trash2, X } from "lucide-react";
import { getOrders, getOrdersQuantityRange, getOrdersTotalRange } from "../_data";
import { ColumnDef, Table } from "@tanstack/react-table";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { use, useCallback, useMemo, useState, useTransition } from "react";
import { FaCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTableActionBarAction } from "@/components/data-table-action-bar";
import { toast } from "sonner";
import { deleteOrders, updateOrdersFulfillmentStatus } from "../_actions";
import { TooltipContent } from "@/components/ui/tooltip";
import { DataTableActionBar } from "@/components/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { isPrivileged } from "@/lib/utils";
import { OrgMember } from "@/types";

type Order = Awaited<ReturnType<typeof getOrders>>["data"][number];

const supabase = createClient();

interface GetOrdersTableColumnsProps {
  orgId: string;
  totalRange: { min: number; max: number };
  itemsCountRange: { min: number; max: number };
  orgMember: OrgMember;
}
function getOrdersTableColumns({
  orgId,
  totalRange,
  itemsCountRange,
  orgMember,
}: GetOrdersTableColumnsProps): ColumnDef<Order>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      meta: {
        permitted: isPrivileged(orgMember.role),
      },
    },
    {
      id: "order_number",
      accessorKey: "order_number",
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
      cell: ({ row }) => (
        <Button variant="link" size="sm" asChild>
          <Link href={`/orgs/${orgId}/orders/${row.original.id}`}>
            #{row.original.order_number}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      ),
      meta: {
        label: "Order Number",
        placeholder: "Order #",
        variant: "text",
        icon: Text,
      },
    },
    {
      id: "product",
      accessorKey: "product.name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
      cell: ({ row }) => {
        const product = row.original.product;
        const image = product.image ? supabase.storage.from("media").getPublicUrl(product.image).data.publicUrl : null;

        return (
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
        );
      },
      meta: {
        label: "Product",
      },
    },
    {
      id: "customer",
      accessorKey: "product.customer.name",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      cell: ({ row }) => (
        <Button variant="link" size="sm" asChild>
          <Link href={`/orgs/${orgId}/customers/${row.original.product.customer.id}`}>
            {row.original.product.customer.name}
          </Link>
        </Button>
      ),
      meta: {
        label: "Customer",
      },
    },
    {
      id: "fulfillment_status",
      accessorKey: "fulfillment_status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fulfillment Status" />,
      cell: ({ row }) => {
        const status = row.original.fulfillment_status;

        return (
          <div className="flex items-center">
            <Badge className="text-2xs capitalize" variant="outline">
              <FaCircle
                className={`size-[1em] mr-2 ${status === "fulfilled" ? "text-green-400" : status === "pending" ? "text-yellow-500" : "text-red-500"}`}
              />
              {status}
            </Badge>
          </div>
        );
      },
      meta: {
        label: "Fulfillment Status",
        variant: "multiSelect",
        options: [
          { label: "Pending", value: "pending", icon: () => <FaCircle className="!size-[0.8em] text-yellow-500" /> },
          { label: "Fulfilled", value: "fulfilled", icon: () => <FaCircle className="!size-[0.8em] text-green-400" /> },
          { label: "Cancelled", value: "cancelled", icon: () => <FaCircle className="!size-[0.8em] text-red-500" /> },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: "total",
      accessorKey: "total",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span>${row.getValue("total")}</span>
          </div>
        );
      },
      meta: {
        label: "Total",
        variant: "range",
        range: [totalRange.min, totalRange.max],
        unit: "$",
        icon: DollarSign,
      },
      enableColumnFilter: true,
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
      cell: ({ row }) => {
        const qty = row.original.quantity;

        return (
          <div className="flex items-center">
            <span>{qty}</span>
          </div>
        );
      },
      meta: {
        label: "Quantity",
        variant: "range",
        range: [itemsCountRange.min, itemsCountRange.max],
        unit: "qty",
      },
      enableColumnFilter: true,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      enableHiding: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => {
        const createdAt = row.original.created_at;
        const date = new Date(createdAt);

        return (
          <div className="flex items-center">
            {date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        );
      },
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: Calendar,
      },
      enableColumnFilter: true,
    },
  ];
}

interface OrdersTableProps {
  orgMember: OrgMember;
  promises: Promise<
    [
      Awaited<ReturnType<typeof getOrders>>,
      Awaited<ReturnType<typeof getOrdersTotalRange>>,
      Awaited<ReturnType<typeof getOrdersQuantityRange>>,
    ]
  >;
}
export function OrdersTable({ orgMember, promises }: OrdersTableProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const [{ data, count, params }, totalRange, itemsCountRange] = use(promises);

  console.log({ params, totalRange, itemsCountRange });

  const columns = useMemo(
    () => getOrdersTableColumns({ orgId, totalRange, itemsCountRange, orgMember }),
    [orgId, totalRange, itemsCountRange, orgMember],
  );

  const { table } = useDataTable({
    data,
    columns: columns.filter((column) => (column.meta?.permitted === undefined ? true : column.meta.permitted)),
    pageCount: count ? Math.ceil(count / params.perPage) : 0,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: {
        pageIndex: params.page - 1,
        pageSize: params.perPage,
      },
    },
  });

  return (
    <div className="data-table-container w-full overflow-hidden">
      <DataTable table={table} actionBar={isPrivileged(orgMember.role) ? <OrdersTableActionBar table={table} /> : null}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            OrdersTableActionBar                            */
/* -------------------------------------------------------------------------- */
const actions = [
  "update-fulfillment-status:pending",
  "update-fulfillment-status:fulfilled",
  "update-fulfillment-status:cancelled",
  "delete",
] as const;

type Action = (typeof actions)[number];

interface OrdersTableActionBarProps {
  table: Table<Order>;
}

function OrdersTableActionBar({ table }: OrdersTableActionBarProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = useTransition();
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  const getIsActionPending = useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onOrderFulfillmentStatusUpdate = useCallback(
    ({ value }: { value: Order["fulfillment_status"] }) => {
      setCurrentAction(`update-fulfillment-status:${value}`);
      startTransition(async () => {
        try {
          const orders = await updateOrdersFulfillmentStatus({
            orgId,
            orderIds: rows.map((row) => row.original.id),
            fulfillment_status: value,
          });

          toast.success(`Order${orders.length === 1 ? "" : "s"} Fulfillment Status Updated`, {
            description: `${orders.length} order${orders.length === 1 ? "" : "s"} fulfillment status updated to ${value}`,
          });
        } catch (error) {
          toast.error("Order Fulfillment Status Update Failed", {
            description: error instanceof Error ? error.message : "Something went wrong. Try again.",
          });
        } finally {
          table.toggleAllRowsSelected(false);
        }
      });
    },
    [table, rows],
  );

  const onOrderDelete = useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      try {
        const orders = await deleteOrders({
          orgId,
          orderIds: rows.map((row) => row.original.id),
        });

        toast.success(`Order${orders.length === 1 ? "" : "s"} Deleted`, {
          description: `${orders.length} order${orders.length === 1 ? "" : "s"} deleted`,
        });
      } catch (error) {
        toast.error("Order Deletion Failed", {
          description: error instanceof Error ? error.message : "Something went wrong. Try again.",
        });
      } finally {
        table.toggleAllRowsSelected(false);
      }
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <div className="flex h-7 items-center rounded-md border pr-1 pl-2.5">
        <span className="whitespace-nowrap text-xs">{rows.length} selected</span>
        <Separator orientation="vertical" className="mr-1 ml-2 data-[orientation=vertical]:h-4" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-5 [&>svg]:size-3.5"
              onClick={() => table.toggleAllRowsSelected(false)}
            >
              <X />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2 border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
            <p>Clear selection</p>
            <kbd className="select-none rounded border bg-background px-1.5 py-px font-mono font-normal text-[0.7rem] text-foreground shadow-xs disabled:opacity-50">
              <abbr title="Escape" className="no-underline">
                Esc
              </abbr>
            </kbd>
          </TooltipContent>
        </Tooltip>
      </div>
      <Separator orientation="vertical" className="hidden data-[orientation=vertical]:h-5 sm:block" />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="Fulfillment Status: Pending"
          isPending={getIsActionPending("update-fulfillment-status:pending")}
          onClick={() => onOrderFulfillmentStatusUpdate({ value: "pending" })}
        >
          <FaCircle className="size-[0.8em] text-yellow-500" />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Fulfillment Status: Fulfilled"
          isPending={getIsActionPending("update-fulfillment-status:fulfilled")}
          onClick={() => onOrderFulfillmentStatusUpdate({ value: "fulfilled" })}
        >
          <FaCircle className="size-[0.8em] text-green-400" />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Fulfillment Status: Cancelled"
          isPending={getIsActionPending("update-fulfillment-status:cancelled")}
          onClick={() => onOrderFulfillmentStatusUpdate({ value: "cancelled" })}
        >
          <FaCircle className="size-[0.8em] text-red-500" />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete orders"
          isPending={getIsActionPending("delete")}
          onClick={onOrderDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
