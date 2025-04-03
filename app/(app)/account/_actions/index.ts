"use server";

import { createClient } from "@/utils/supabase/client/server";
import { Database } from "@/utils/supabase/types";
import { revalidateTag, unstable_noStore } from "next/cache";

/* -------------------------------------------------------------------------- */
/*                                 updateUser                                 */
/* -------------------------------------------------------------------------- */
interface UpdateUserProps {
  userId: string;
  user: Database["public"]["Tables"]["users"]["Update"];
}
export const updateUser = async ({ userId, user }: UpdateUserProps) => {
  unstable_noStore();

  const supabase = await createClient();

  const { data: updatedUser } = await supabase
    .from("users")
    .update(user)
    .eq("id", userId)
    .select("*")
    .single()
    .throwOnError();

  revalidateTag("user");

  return updatedUser;
};
