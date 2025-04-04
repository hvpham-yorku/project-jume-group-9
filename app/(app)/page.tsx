import { redirect } from "next/navigation";

export default async function AdminPage() {
  return redirect("/orgs");
}
