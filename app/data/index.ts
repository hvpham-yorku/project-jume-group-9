import { createClient } from "@/utils/supabase/client/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(`Error fetching auth user: ${error || "No user found"}`);
    return redirect("/auth/sign-in");
  }

  return user;
});

export const getUser = cache(async () => {
  const supabase = await createClient();
  const authUser = await getAuthUser();

  const { data: user } = await supabase.from("users").select("*").eq("id", authUser.id).single().throwOnError();

  return user;
});

export const getOrgMember = cache(async ({ orgId }: { orgId: string }) => {
  const supabase = await createClient();
  const authUser = await getAuthUser();

  const { data: orgMember } = await supabase
    .from("org_members")
    .select("*, user:users(*), org:orgs(*)")
    .eq("user_id", authUser.id)
    .eq("org_id", orgId)
    .single()
    .throwOnError();

  return orgMember;
});

export const getOrg = cache(async ({ orgId }: { orgId: string }) => {
  const supabase = await createClient();
  const { data: org } = await supabase.from("orgs").select("*").eq("id", orgId).single().throwOnError();
  return org;
});

export const getOrgs = cache(async () => {
  const supabase = await createClient();
  const authUser = await getAuthUser();

  const { data: orgMembers } = await supabase
    .from("org_members")
    .select("org:orgs(*)")
    .eq("user_id", authUser.id)
    .throwOnError();

  return orgMembers.map((orgMember) => orgMember.org);
});
