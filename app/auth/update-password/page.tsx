"use client";

import type React from "react";

import { useSupabaseClient } from "@/lib/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Lock, Wind } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const supabase = useSupabaseClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const passwordStrength = {
    length: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
  };

  const isStrong = passwordStrength.length &&
    passwordStrength.hasUpperCase &&
    passwordStrength.hasLowerCase &&
    passwordStrength.hasNumbers;

  const handleUpdatePassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setError("Password service is currently unavailable.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      router.push("/auth/login");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 p-4">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
              <Wind className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ComfortRent
            </span>
          </Link>
        </div>

        <Card className="border-slate-200 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-slate-900">
                  Create new password
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-slate-600">
              Set a strong password to secure your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  disabled={isLoading}
                />
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-slate-600">
                      Password strength:
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1 flex-1 rounded-full ${
                            passwordStrength.length
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        />
                        <span className="text-xs text-slate-600">
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1 flex-1 rounded-full ${
                            passwordStrength.hasUpperCase
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        />
                        <span className="text-xs text-slate-600">
                          One uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1 flex-1 rounded-full ${
                            passwordStrength.hasLowerCase
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        />
                        <span className="text-xs text-slate-600">
                          One lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1 flex-1 rounded-full ${
                            passwordStrength.hasNumbers
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        />
                        <span className="text-xs text-slate-600">
                          One number
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-slate-700 font-medium"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  disabled={isLoading}
                />
                {password && confirmPassword && password === confirmPassword &&
                  (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      Passwords match
                    </div>
                  )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                disabled={isLoading || !isStrong ||
                  password !== confirmPassword}
              >
                {isLoading ? "Updating password..." : "Update password"}
              </Button>

              <div className="flex items-center justify-center">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
