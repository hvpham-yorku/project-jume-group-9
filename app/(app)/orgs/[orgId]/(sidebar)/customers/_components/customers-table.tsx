"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataTable } from "@/hooks/use-data-table";
import { createClient } from "@/utils/supabase/client/client";
import { Calendar, ChevronRight, Text, Trash2, X } from "lucide-react";
import { getCustomers, getCustomerCities, getCustomer } from "../_data";
import { ColumnDef, Table } from "@tanstack/react-table";
import { use, useCallback, useMemo, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTableActionBarAction } from "@/components/data-table-action-bar";
import { toast } from "sonner";
import { deleteCustomers } from "../_actions";
import { TooltipContent } from "@/components/ui/tooltip";
import { DataTableActionBar } from "@/components/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { isPrivileged } from "@/lib/utils";
import { OrgMember } from "@/types";

type Customer = Awaited<ReturnType<typeof getCustomer>>["data"];

interface GetCustomersTableColumnsProps {
  orgId: string;
  cities: string[];
  orgMember: OrgMember;
}
function getCustomersTableColumns({ orgId, cities, orgMember }: GetCustomersTableColumnsProps): ColumnDef<Customer>[] {
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
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <Button variant="link" size="sm" asChild>
          <Link href={`/orgs/${orgId}/customers/${row.original.id}`}>
            {row.original.name}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      ),
      meta: {
        label: "Name",
        placeholder: "Name",
        variant: "text",
        icon: Text,
      },
    },
    {
      id: "city",
      accessorKey: "city",
      header: ({ column }) => <DataTableColumnHeader column={column} title="City" />,
      cell: ({ row }) => {
        return (
          <p>
            <span>{row.original.city}</span>
            {row.original.country && <span>, {row.original.country}</span>}
          </p>
        );
      },
      meta: {
        label: "City",
        variant: "multiSelect",
        options: cities.map((city) => ({ label: city, value: city })),
      },
      enableColumnFilter: true,
    },
    {
      id: "email",
      accessorKey: "email",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => {
        const email = row.original.email;

        return (
          <div className="flex items-center">
            <span>{email}</span>
          </div>
        );
      },
      meta: {
        label: "Email",
      },
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

interface CustomersTableProps {
  orgMember: OrgMember;
  promises: Promise<[Awaited<ReturnType<typeof getCustomers>>, Awaited<ReturnType<typeof getCustomerCities>>]>;
}
export function CustomersTable({ orgMember, promises }: CustomersTableProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const [{ data, count, params }, cities] = use(promises);

  console.log({ params, cities });

  const columns = useMemo(() => getCustomersTableColumns({ orgId, cities, orgMember }), [orgId, cities, orgMember]);

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
        actionBar={isPrivileged(orgMember.role) ? <CustomersTableActionBar table={table} /> : null}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           CustomersTableActionBar                          */
/* -------------------------------------------------------------------------- */
const actions = ["delete"] as const;

type Action = (typeof actions)[number];

interface CustomersTableActionBarProps {
  table: Table<Customer>;
}

export function CustomersTableActionBar({ table }: CustomersTableActionBarProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = useTransition();
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  const getIsActionPending = useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onCustomerDelete = useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      try {
        const customers = await deleteCustomers({
          orgId,
          customerIds: rows.map((row) => row.original.id),
        });

        toast.success(`Customer${customers.length === 1 ? "" : "s"} Deleted`, {
          description: `${customers.length} customer${customers.length === 1 ? "" : "s"} deleted`,
        });
      } catch (error) {
        toast.error("Customer Deletion Failed", {
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
          tooltip="Delete customers"
          isPending={getIsActionPending("delete")}
          onClick={onCustomerDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
