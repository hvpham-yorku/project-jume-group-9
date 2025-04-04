"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { Calendar, Text } from "lucide-react";
import { getActivities } from "../_data";
import { ColumnDef } from "@tanstack/react-table";
import { use, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initialify } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client/client";

type Activity = Awaited<ReturnType<typeof getActivities>>["data"][number];

const supabase = createClient();

function getActivitiesTableColumns(): ColumnDef<Activity>[] {
  return [
    {
      id: "user",
      accessorKey: "user",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Member" />,
      cell: ({ row }) => {
        const { full_name, avatar_url } = row.original.user;
        const initials = initialify(full_name);
        const userImage = avatar_url
          ? avatar_url.startsWith("http")
            ? avatar_url
            : supabase.storage.from("media").getPublicUrl(avatar_url).data.publicUrl
          : null;

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-sm">
              {userImage && <AvatarImage src={userImage} alt={full_name} />}
              <AvatarFallback className="rounded-sm">{initials}</AvatarFallback>
            </Avatar>
            <span>{full_name}</span>
          </div>
        );
      },
      meta: {
        label: "Member",
      },
    },
    {
      id: "q",
      accessorKey: "action",
      enableHiding: false,
      enableColumnFilter: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => <Badge className="uppercase">{row.original.action}</Badge>,
      meta: {
        label: "Action",
        placeholder: "Search activities...",
        variant: "text",
        icon: Text,
      },
    },

    {
      id: "description",
      accessorKey: "description",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => <p className="flex items-center max-w-[60ch] text-left">{row.original.description}</p>,
      meta: {
        label: "Description",
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
  ];
}

interface ActivitiesTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getActivities>>]>;
}
export function ActivitiesTable({ promises }: ActivitiesTableProps) {
  const [{ data, count, params }] = use(promises);

  const columns = useMemo(() => getActivitiesTableColumns(), []);

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
