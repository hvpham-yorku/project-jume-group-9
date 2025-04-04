"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { Calendar, ImageIcon, PlusIcon, Text } from "lucide-react";
import { getNotifications } from "../_data";
import { ColumnDef } from "@tanstack/react-table";
import { use, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
type Notification = Awaited<ReturnType<typeof getNotifications>>["data"][number];

const supabase = createClient();

interface GetNotificationsTableColumnsProps {
  orgId: string;
}
function getNotificationsTableColumns({ orgId }: GetNotificationsTableColumnsProps): ColumnDef<Notification>[] {
  return [
    {
      id: "product",
      accessorKey: "product.name",
      enableHiding: false,
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
      id: "inventory_quantity",
      accessorKey: "product.inventory_quantity",
      enableSorting: false,
      enableHiding: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Inventory Quantity" />,
      cell: ({ row }) => <div className="flex items-center">{row.original.product.inventory_quantity}</div>,
      meta: {
        label: "Inventory Quantity",
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => {
        const createdAt = row.original.created_at;
        const date = new Date(createdAt);

        return (
          <div className="flex items-center">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
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
    {
      id: "action",
      cell: ({ row }) => {
        const product = row.original.product;

        return (
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" asChild>
              <Link href={`/orgs/${orgId}/orders/new?product=${product.id}`}>
                Create Order
                <PlusIcon className="size-4" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
}

interface NotificationsTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getNotifications>>]>;
}
export function NotificationsTable({ promises }: NotificationsTableProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const [{ data, count, params }] = use(promises);

  const columns = useMemo(() => getNotificationsTableColumns({ orgId }), []);

  const { table } = useDataTable({
    data,
    columns,
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
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
