import { getAuthUser } from "@/app/data";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/providers/react-query";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await getAuthUser();

  return (
    <ReactQueryProvider>
      <NuqsAdapter>
        {children}
        <Toaster richColors />
      </NuqsAdapter>
    </ReactQueryProvider>
  );
}
