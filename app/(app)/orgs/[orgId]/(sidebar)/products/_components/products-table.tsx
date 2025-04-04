"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataTable } from "@/hooks/use-data-table";
import { createClient } from "@/utils/supabase/client/client";
import { ArrowUp, Calendar, CheckCircle2, DollarSign, Download, Text, Trash2, X } from "lucide-react";
import { getProducts, getProductsCategories, getProductsInventoryQuantityRange, getProductsPriceRange } from "../_data";
import { ColumnDef, Table } from "@tanstack/react-table";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { use, useCallback, useMemo, useState, useTransition } from "react";
import { FaCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTableActionBarAction } from "@/components/data-table-action-bar";
import { DataTableActionBar } from "@/components/data-table-action-bar";
import { toast } from "sonner";
import { deleteProducts, updateProductsStatus } from "../_actions";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { isPrivileged } from "@/lib/utils";
import { OrgMember } from "@/types";

type Product = Awaited<ReturnType<typeof getProducts>>["data"][number];

const supabase = createClient();

interface GetProductsTableColumnsProps {
  orgId: string;
  priceRange: { min: number; max: number };
  inventoryQuantityRange: { min: number; max: number };
  categories: string[];
  orgMember: OrgMember;
}
function getProductsTableColumns({
  orgId,
  priceRange,
  inventoryQuantityRange,
  categories,
  orgMember,
}: GetProductsTableColumnsProps): ColumnDef<Product>[] {
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
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
      cell: ({ row }) => {
        const product = row.original;
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
        placeholder: "Search Products...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => <span className="capitalize">{row.original.category}</span>,
      meta: {
        label: "Category",
        variant: "multiSelect",
        options: categories.map((category) => ({ label: category, value: category })),
      },
      enableColumnFilter: true,
    },
    {
      id: "customer",
      accessorKey: "customer.name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      cell: ({ row }) => (
        <Button variant="link" size="sm" asChild>
          <Link href={`/orgs/${orgId}/customers/${row.original.customer.id}`}>{row.original.customer.name}</Link>
        </Button>
      ),
      meta: {
        label: "Customer",
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div className="flex items-center">
            <Badge className="text-2xs capitalize" variant="outline">
              <FaCircle
                className={`size-[1em] mr-2 ${status === "active" ? "text-green-400" : status === "draft" ? "text-cyan-300" : "text-orange-500"}`}
              />
              {status}
            </Badge>
          </div>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          { label: "Active", value: "active", icon: () => <FaCircle className="!size-[0.8em] text-green-400" /> },
          { label: "Draft", value: "draft", icon: () => <FaCircle className="!size-[0.8em] text-cyan-300" /> },
          { label: "Archived", value: "archived", icon: () => <FaCircle className="!size-[0.8em] text-orange-500" /> },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span>${row.getValue("price")}</span>
          </div>
        );
      },
      meta: {
        label: "Price",
        variant: "range",
        range: [priceRange.min, priceRange.max],
        unit: "$",
        icon: DollarSign,
      },
      enableColumnFilter: true,
    },
    {
      id: "inventory_quantity",
      accessorKey: "inventory_quantity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Inventory Quantity" />,
      cell: ({ row }) => {
        const qty = row.original.inventory_quantity;

        return (
          <div className="flex items-center">
            <span>{qty}</span>
          </div>
        );
      },
      meta: {
        label: "Inventory Quantity",
        variant: "range",
        range: [inventoryQuantityRange.min, inventoryQuantityRange.max],
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

interface ProductsTableProps {
  orgMember: OrgMember;
  promises: Promise<
    [
      Awaited<ReturnType<typeof getProducts>>,
      Awaited<ReturnType<typeof getProductsPriceRange>>,
      Awaited<ReturnType<typeof getProductsInventoryQuantityRange>>,
      Awaited<ReturnType<typeof getProductsCategories>>,
    ]
  >;
}
export function ProductsTable({ orgMember, promises }: ProductsTableProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const [{ data, count, params }, priceRange, inventoryQuantityRange, categories] = use(promises);

  console.log({ params, priceRange, inventoryQuantityRange, categories });

  const columns = useMemo(
    () => getProductsTableColumns({ orgId, priceRange, inventoryQuantityRange, categories, orgMember }),
    [orgId, priceRange, inventoryQuantityRange, categories, orgMember],
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
      <DataTable
        table={table}
        actionBar={isPrivileged(orgMember.role) ? <ProductsTableActionBar table={table} /> : null}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           ProductsTableActionBar                           */
/* -------------------------------------------------------------------------- */
const actions = ["update-status:active", "update-status:draft", "update-status:archived", "delete"] as const;

type Action = (typeof actions)[number];

interface ProductsTableActionBarProps {
  table: Table<Product>;
}

function ProductsTableActionBar({ table }: ProductsTableActionBarProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = useTransition();
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  const getIsActionPending = useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onProductStatusUpdate = useCallback(
    ({ value }: { value: Product["status"] }) => {
      setCurrentAction(`update-status:${value}`);
      startTransition(async () => {
        try {
          const products = await updateProductsStatus({
            orgId,
            productIds: rows.map((row) => row.original.id),
            status: value,
          });

          toast.success(`Product${products.length === 1 ? "" : "s"} Status Updated`, {
            description: `${products.length} product${products.length === 1 ? "" : "s"} status updated to ${value}`,
          });
        } catch (error) {
          toast.error("Product Status Update Failed", {
            description: error instanceof Error ? error.message : "Something went wrong. Try again.",
          });
        } finally {
          table.toggleAllRowsSelected(false);
        }
      });
    },
    [table, rows],
  );

  const onProductDelete = useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      try {
        const products = await deleteProducts({
          orgId,
          productIds: rows.map((row) => row.original.id),
        });

        toast.success(`Product${products.length === 1 ? "" : "s"} Deleted`, {
          description: `${products.length} product${products.length === 1 ? "" : "s"} deleted`,
        });
      } catch (error) {
        toast.error("Product Deletion Failed", {
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
          tooltip="Status: Active"
          isPending={getIsActionPending("update-status:active")}
          onClick={() => onProductStatusUpdate({ value: "active" })}
        >
          <FaCircle className="size-[0.8em] text-green-400" />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Status: Draft"
          isPending={getIsActionPending("update-status:draft")}
          onClick={() => onProductStatusUpdate({ value: "draft" })}
        >
          <FaCircle className="size-[0.8em] text-cyan-300" />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Status: Archived"
          isPending={getIsActionPending("update-status:archived")}
          onClick={() => onProductStatusUpdate({ value: "archived" })}
        >
          <FaCircle className="size-[0.8em] text-orange-500" />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete products"
          isPending={getIsActionPending("delete")}
          onClick={onProductDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
