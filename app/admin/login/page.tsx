"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@/lib/hooks/use-supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Trim whitespace from inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Static admin credentials
    const STATIC_ADMIN_EMAIL = "admin@comfortrent.com";
    const STATIC_ADMIN_PASSWORD = "admin123";

    // Check if using static admin credentials
    if (
      trimmedEmail === STATIC_ADMIN_EMAIL &&
      trimmedPassword === STATIC_ADMIN_PASSWORD
    ) {
      const adminSession = {
        id: "static-admin",
        email: STATIC_ADMIN_EMAIL,
        role: "admin",
        loginTime: new Date().toISOString(),
      };

      try {
        // Try to set via API route for server-side cookie
        await fetch("/api/auth/set-admin-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminSession),
        });

        // Store in localStorage as backup
        localStorage.setItem("admin_session", JSON.stringify(adminSession));

        setLoading(false);
        router.push("/admin/dashboard");
        return;
      } catch (err) {
        console.error("[v0] Error with admin login:", err);
        setError("Failed to login securely. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Safety check for supabase client
    if (!supabase) {
      setError(
        "Login system is currently unavailable (Missing configuration).",
      );
      setLoading(false);
      return;
    }

    try {
      // Sign in via Supabase
      const { data: authData, error: authError } = await supabase.auth
        .signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut();
          setError("Access denied. Admin privileges required.");
          setLoading(false);
          return;
        }

        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("[v0] Auth error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@comfortrent.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading
                ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                )
                : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In as Admin
                  </>
                )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              ← Back to website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
