import { getOrgMember, getUser } from "@/app/data";
import "@tanstack/react-table";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export type OrgMember = Awaited<ReturnType<typeof getOrgMember>> & {
  user: NonNullable<Awaited<ReturnType<typeof getOrgMember>>["user"]>;
};
export type User = Awaited<ReturnType<typeof getUser>>;

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    permitted?: boolean;
  }
}
