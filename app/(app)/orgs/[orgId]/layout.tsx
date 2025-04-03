import React from "react";

import { getOrg } from "@/app/data";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { orgId } = await params;
  const org = await getOrg({ orgId });

  if (!org)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Alert variant="default" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have access to this organization. Please contact your administrator to be added to an
            organization.
          </AlertDescription>
        </Alert>
      </div>
    );

  return children;
}
