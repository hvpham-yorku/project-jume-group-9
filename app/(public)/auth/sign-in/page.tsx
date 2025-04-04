"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client/client";
import { useSearchParams } from "next/navigation";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Home() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return_to");

  async function signInWithGithub() {
    const redirectTo = new URL("/api/auth/callback", window.location.origin);

    if (returnTo) {
      redirectTo.searchParams.append("redirect_to", returnTo);
    }

    redirectTo.searchParams.append("provider", "github");

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirectTo.toString(),
      },
    });
  }

  async function signInWithGoogle() {
    const redirectTo = new URL("/api/auth/callback", window.location.origin);

    if (returnTo) {
      redirectTo.searchParams.append("redirect_to", returnTo);
    }

    redirectTo.searchParams.append("provider", "google");

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
      },
    });

    console.log({ error, data });
  }

  return (
    <div className="flex w-full h-screen">
      <div className=" p-4 w-full border-r flex flex-col justify-center items-center">
        <div className="max-w-sm ">
          <h1 className="font-max text-3xl mb-8">Login to SmartStock</h1>

          <Button className="w-full m-1" onClick={() => signInWithGoogle()}>
            <FaGoogle />
            Continue with Google
          </Button>

          <Button className="w-full m-1" onClick={() => signInWithGithub()}>
            <FaGithub /> Continue with Github
          </Button>

          {/* terms */}
          <div className=" text-left  text-sm text-gray-500 mt-9">
            <h5>
              By clicking continue or Sign In, you aknowledge that you have read and agreed to Terms of Service and
              Privacy Policy
            </h5>
          </div>
        </div>
      </div>
      <div className="bg-green-500z p-4 w-full flex flex-col justify-center items-center">
        <h2 className="text-2xl font-medium text-center">
          Warehouse Management System <br /> of the 21st Century
        </h2>
      </div>
    </div>
  );
}
