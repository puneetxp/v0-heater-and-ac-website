"use client";

import { useState } from "react";
import { useSupabaseClient } from "@/lib/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wind, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    if (!supabase) {
      setError("Authentication service is currently unavailable.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "An error occurred during Google login");
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!supabase) {
      setError("Authentication service unavailable.");
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check admin_users table for admin role
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("id, is_active")
          .eq("email", user.email)
          .single();

        if (adminUser && adminUser.is_active) {
          // Set secure admin session via API (no localStorage)
          const sessionResponse = await fetch("/api/auth/verify-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, password }),
          });

          if (sessionResponse.ok) {
            router.push("/admin/dashboard");
            return;
          }
        }

        // Regular user - check for active bookings
        const { data: activeBookings } = await supabase
          .from("bookings")
          .select("id")
          .eq("user_id", user.id)
          .in("status", ["pending", "subscribed", "active"])
          .limit(1);

        if (activeBookings && activeBookings.length > 0) {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Wind className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              ACRentService
            </span>
          </Link>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-black text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Log in to manage your rentals and bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 gap-3 border-slate-200 hover:bg-slate-50 hover:border-primary/30 transition-all font-bold"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-white px-4 text-slate-400">Or Email Login</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-slate-200 focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/reset-password" title="reset" className="text-xs text-primary hover:underline font-bold">
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-slate-200 focus:border-primary/50"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/95 shadow-lg shadow-primary/20 font-bold">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary hover:underline font-bold">
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
