import { getUser } from "@/app/data";
import UpdateAccountForm from "./_components/update-account-form";

export default async function AccountPage() {
  const user = await getUser();

  return <UpdateAccountForm user={user} />;
}
