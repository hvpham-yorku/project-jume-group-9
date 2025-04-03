"use client"; // Enables client-side rendering for this component

// Core components and utilities for the DataTable and UI
import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataTable } from "@/hooks/use-data-table";
import { createClient } from "@/utils/supabase/client/client";

// Icons for column meta UI representation
import { Calendar, ChevronRight, Text } from "lucide-react";

// Supabase data fetchers
import { getCustomers, getCustomerCities, getCustomer } from "../_data";
import { ColumnDef } from "@tanstack/react-table";

// React & Next.js tools
import { use, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// UI components
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isPrivileged } from "@/lib/utils";
import { OrgMember } from "@/types";

/**
 * Infers the shape of a customer object from the Supabase data fetcher
 */
type Customer = Awaited<ReturnType<typeof getCustomer>>["data"];

/**
 * Props used to define the dynamic columns of the customer table
 */
interface GetCustomersTableColumnsProps {
  orgId: string;
  cities: string[];
  orgMember: OrgMember;
}

/**
 * Defines column configuration for the Customers table.
 * Includes access control and UI metadata for filters/search/icons.
 */
function getCustomersTableColumns({ orgId, cities, orgMember }: GetCustomersTableColumnsProps): ColumnDef<Customer>[] {
  return [
    // Checkbox column for multi-select (only for privileged users)
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
        permitted: isPrivileged(orgMember.role), // Only show for Admin/Manager
      },
    },
    // Name column with link to customer profile
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
    // City column, includes country if available
    {
      id: "city",
      accessorKey: "city",
      header: ({ column }) => <DataTableColumnHeader column={column} title="City" />,
      cell: ({ row }) => (
        <p>
          <span>{row.original.city}</span>
          {row.original.country && <span>, {row.original.country}</span>}
        </p>
      ),
      meta: {
        label: "City",
        variant: "multiSelect",
        options: cities.map((city) => ({ label: city, value: city })),
      },
      enableColumnFilter: true,
    },
    // Email column (non-filterable, display only)
    {
      id: "email",
      accessorKey: "email",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <span>{row.original.email}</span>,
      meta: {
        label: "Email",
      },
    },
    // Created At date column, supports filtering by date range
    {
      id: "created_at",
      accessorKey: "created_at",
      enableHiding: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return <span>{date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>;
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

/**
 * Props required to render the CustomersTable component.
 * Uses server-side promises to preload customer data and city filters.
 */
interface CustomersTableProps {
  orgMember: OrgMember;
  promises: Promise<[Awaited<ReturnType<typeof getCustomers>>, Awaited<ReturnType<typeof getCustomerCities>>]>;
}

/**
 * CustomersTable component
 * - Renders a fully featured customer table with filtering, pagination, and role-based access
 * - Uses TanStack Table, Supabase data, and role validation
 */
export function CustomersTable({ orgMember, promises }: CustomersTableProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const [{ data, count, params }, cities] = use(promises); // Destructure data and filters from resolved promise

  // Dynamically build columns based on role and available cities
  const columns = useMemo(
    () => getCustomersTableColumns({ orgId, cities, orgMember }),
    [orgId, cities, orgMember]
  );

  // Initialize table logic with pagination, filtering, and column restrictions
  const { table } = useDataTable({
    data,
    columns: columns.filter((column) =>
      column.meta?.permitted === undefined ? true : column.meta.permitted
    ),
    pageCount: count ? Math.ceil(count / params.perPage) : 0,
    getRowId: (row) => row.id,
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

/* -------------------------------------------------------------------------- */
/*                           CustomersTableActionBar                          */
/* -------------------------------------------------------------------------- */
// TODO: Add multi-row deletion feature for privileged users (Admin/Manager)