import React from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client/server";
import { getAuthUser, getOrgs } from "@/app/data";

export default async function OrgPickerPage() {
  const supabase = await createClient();

  const [user, orgs] = await Promise.all([getAuthUser(), getOrgs()]);

  if (orgs.length === 0) {
    if (process.env.NODE_ENV === "development") {
      await supabase.rpc("assign_user_to_all_orgs", { user_id_param: user.id });
      return redirect("/");
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <Alert variant="default" className="w-full max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No organizations found</AlertTitle>
            <AlertDescription>
              You are not a member of any organization. Please contact your administrator to be added to an
              organization.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  if (orgs.length === 1) {
    return redirect(`/orgs/${orgs[0].id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Your Warehouses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 ">
            {orgs.map((org) => (
              <Button key={org.id} asChild variant="outline">
                <Link href={`/orgs/${org.id}`} className="flex justify-between items-center w-full">
                  <p>{org.name}</p>
                  <ArrowRight />
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
