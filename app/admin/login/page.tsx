"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCreatingFirstAdmin, setIsCreatingFirstAdmin] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Trim whitespace from inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    try {
      // Verify admin credentials via secure server endpoint (no hardcoded credentials in client)
      const response = await fetch("/api/auth/verify-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      if (response.ok) {
        // Server sets secure httpOnly cookie - no localStorage needed
        setSuccess("Login successful!");
        setTimeout(() => router.push("/admin/dashboard"), 500);
        return;
      } else {
        const data = await response.json();
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("[v0] Error with admin login:", err);
      setError("Failed to login. Please try again.");
      setLoading(false);
      return;
    }
  };

  const handleCreateFirstAdmin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsCreatingFirstAdmin(true);
    setError(null);
    setSuccess(null);

    // Trim whitespace from inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required");
      setIsCreatingFirstAdmin(false);
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsCreatingFirstAdmin(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/init-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Admin account created! Switching to login mode...");
        setShowCreateForm(false);
        setPassword("");
        setTimeout(() => {
          handleLogin(e);
        }, 1000);
        return;
      } else {
        setError(data.error || "Failed to create admin account");
        setIsCreatingFirstAdmin(false);
        return;
      }
    } catch (err) {
      console.error("[v0] Error creating admin:", err);
      setError("Failed to create admin account. Please try again.");
      setIsCreatingFirstAdmin(false);
      return;
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {!showCreateForm ? (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
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

              <div className="mt-4 text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(true);
                    setError(null);
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-primary hover:underline"
                >
                  Create first admin account
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleCreateFirstAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isCreatingFirstAdmin}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-password">Password</Label>
                  <Input
                    id="create-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isCreatingFirstAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isCreatingFirstAdmin}
                  size="lg"
                >
                  {isCreatingFirstAdmin
                    ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Admin...
                      </>
                    )
                    : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Create Admin Account
                      </>
                    )}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError(null);
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-primary hover:underline"
                >
                  Back to login
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground border-t pt-4">
            <Link href="/" className="hover:text-primary transition-colors">
              ← Back to website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
