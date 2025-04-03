import React from "react";
import { redirect } from "next/navigation";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getUser, getOrgs, getOrgMember } from "@/app/data";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { orgId } = await params;
  const [orgMember, orgs] = await Promise.all([getOrgMember({ orgId }), getOrgs()]);

  if (orgs.length === 0 || !orgMember.org) return redirect("/");

  return (
    <SidebarProvider
      className="h-svh"
      style={
        {
          "--sidebar-width": "13rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar orgMember={orgMember} orgs={[orgMember.org, ...orgs.filter((o) => o.id !== orgMember.org.id)]}>
        {children}
      </AppSidebar>
    </SidebarProvider>
  );
}
