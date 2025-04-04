import AnalyticsDashboard from "./_components/analytics-dashboard";
import { createClient } from "@/utils/supabase/client/server";
import { getDashboardData } from "./_data";
import { getOrgMember } from "@/app/data";
import { subMonths } from "date-fns";
import { DateRange } from "react-day-picker";

interface HomePageProps {
  params: Promise<{ orgId: string }>;
}
export default async function HomePage({ params }: HomePageProps) {
  const { orgId } = await params;
  const supabase = await createClient();

  const date: DateRange = {
    from: subMonths(new Date(), 6),
    to: new Date(),
  };

  const [orgMember, initialData] = await Promise.all([
    getOrgMember({ orgId }),
    getDashboardData({ supabase, orgId, date }),
  ]);

  return <AnalyticsDashboard orgId={orgId} orgMember={orgMember} initialData={initialData} />;
}
