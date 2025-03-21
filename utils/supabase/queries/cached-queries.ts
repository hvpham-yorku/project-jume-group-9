import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";

import { getOrgMemberByUserIdQuery, getOrgQuery, getUserQuery } from ".";
import { createClient } from "../client/server";


export const getUser = cache(async () => {
  try {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();
    const userId = user?.id;

    if (error || !userId) {
      return null;
    }

    const { data, error: userError } = await getUserQuery({ supabase, userId });

    if (userError || !data) {
      throw new Error(`Error fetching user: ${userError || "No user found"}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getOrg = cache(async ({ orgId }: { orgId: string }) => {
  try {
    const supabase = await createClient();

    const { data, error } = await getOrgQuery({ supabase, orgId });

    if (error || !data) {
      throw new Error(`Error fetching org: ${error || "No org found"}`);
    }

    return data;
  } catch (error) {
    console.error("error: ", error);
    return null;
  }
});


export const getOrgMemberByUserId = cache(async ({ userId, orgId }: { userId: string, orgId: string }) => {
  try {
    const supabase = await createClient();

    const { data, error } = await getOrgMemberByUserIdQuery({ supabase, userId, orgId });

    if (error || !data) {
      throw new Error(`Error fetching org member: ${error || "No org member found"}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
});

