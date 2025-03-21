import React from "react";
import { redirect } from "next/navigation";

import { getOrg, getOrgMemberByUserId, getUser } from "@/utils/supabase/queries/cached-queries";

interface LayoutProps {
  children: React.ReactNode;
  params: { orgId: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { orgId } = await params;

  // Get user
  const user = await getUser();
  console.log("user is", user);
  if (!user) return redirect("/auth/sign-in");

  // Get org
  console.log("orgId is", orgId);
  const org = await getOrg({ orgId });
  console.log("org", org);
  if (!org) return <div>Organization not found</div>;

  // Get org member data of this org based on user id
  const orgMember = await getOrgMemberByUserId({ userId: user.id, orgId: org.id });
  console.log("orgMember", orgMember);
  if (!orgMember) return <div>You dont have access to this org</div>;

  return children;
}
