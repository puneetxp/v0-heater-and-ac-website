"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("[v0] Admin error boundary caught:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
            <Card className="w-full max-w-md border-red-200 shadow-lg">
                <CardHeader className="bg-red-50 border-b border-red-100">
                    <CardTitle className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-6 w-6" />
                        Something went wrong
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <p className="text-slate-600">
                        There was an error loading this admin page. This could
                        be due to a connection issue or a configuration problem.
                    </p>
                    {error.digest && (
                        <p className="text-xs font-mono text-slate-400">
                            Error ID: {error.digest}
                        </p>
                    )}
                    <div className="flex flex-col gap-2">
                        <Button onClick={() => reset()} className="w-full">
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Try again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                window.location.href = "/admin/dashboard"}
                            className="w-full"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
