"use server";

import { createClient } from "@/utils/supabase/client/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/data";

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth/sign-in");
};

interface AddActivityLogActionProps {
  orgId: string;
  action: string;
  description: string;
}
export const addActivityLog = async ({ orgId, action, description }: AddActivityLogActionProps) => {
  const supabase = await createClient();
  const user = await getAuthUser();

  await supabase.from("activity_logs").insert({ org_id: orgId, user_id: user.id, action, description }).throwOnError();
};
