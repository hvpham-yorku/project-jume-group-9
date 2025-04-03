"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGoogle, FaApple, FaFacebook, FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function SignUp() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return_to");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signUpWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  }

  async function signUpWithGoogle() {
    const redirectTo = new URL("/api/auth/callback", window.location.origin);

    if (returnTo) {
      redirectTo.searchParams.append("return_to", returnTo);
    }

    redirectTo.searchParams.append("provider", "google");

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
      },
    });
  }

  async function signUpWithEmail(data: { email: string; password: string }) {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  return (
    <div className="flex w-full h-screen">
      <div className="p-4 w-full border-r flex flex-col justify-center items-center">
        <div className="max-w-sm">
          <h1 className="font-max text-[25px] uppercase mb-8">Welcome to SmartStock.</h1>

          <Button className="w-full m-1" onClick={() => signUpWithGithub()}>
            <FaGithub /> Continue with Github
          </Button>

          <Button className="w-full m-1" onClick={() => signUpWithGoogle()}>
            <FaGoogle />
            Continue with Google
          </Button>

          <Button className="w-full m-1">
            <FaApple />
            Continue with Apple
          </Button>

          <div className="my-6">
            <Separator className="my-4" />
            <p className="text-center text-sm text-gray-500">Or continue with email</p>
          </div>

          <form onSubmit={handleSubmit(signUpWithEmail)} className="space-y-4">
            {/* email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            {/* password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            {/* error */}
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>}
            {/* button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-foreground">
            Already have an account?{" "}
            <Link className="text-primary font-medium underline" href="/auth/sign-in">
              Sign in
            </Link>
          </p>

          {/* terms */}
          <div className="text-left text-sm text-gray-500 mt-9">
            <h5>
              By clicking continue or Sign Up, you acknowledge that you have read and agreed to Terms of Service and
              Privacy Policy
            </h5>
          </div>
        </div>
      </div>
      <div className="bg-green-500z p-4 w-full"></div>
    </div>
  );
}
