import HomeDashboard from "./_components/home-dashboard";
import { createClient } from "@/utils/supabase/client/server";
import { getDashboardData } from "./_data";
import { getOrgMember, getUser } from "@/app/data";

interface HomePageProps {
  params: Promise<{ orgId: string }>;
}
export default async function HomePage({ params }: HomePageProps) {
  const { orgId } = await params;
  const supabase = await createClient();

  const [orgMember, initialData] = await Promise.all([getOrgMember({ orgId }), getDashboardData({ supabase, orgId })]);

  // return <HomeDashboard orgId={orgId} orgMember={orgMember} initialData={initialData} />;

  return <div className="size-full flex items-center justify-center p-10">Home Page [Under Construction]</div>;
}
