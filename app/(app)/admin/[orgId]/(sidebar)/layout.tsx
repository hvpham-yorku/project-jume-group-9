import React from "react";
import { redirect } from "next/navigation";

import { getOrg, getUser } from "@/utils/supabase/queries/cached-queries";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: { orgId: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { orgId } = await params;
  const user = await getUser();
  if (!user) return redirect("/auth/sign-in");

  console.log("orgId", orgId);
  console.log("user", user);

  const org = await getOrg({ orgId });
  if (!org) return redirect("/admin");

  return (
    <SidebarProvider
      className="h-svh"
      style={
        {
          "--sidebar-width": "13rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} org={org}>
        {children}
      </AppSidebar>
    </SidebarProvider>
  );
}
