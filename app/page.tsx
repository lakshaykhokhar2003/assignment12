"use client";

import { useState, FormEvent } from "react";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks";

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 300));

        const success = login(username, password);

        if (!success) {
            setError("Invalid credentials. Please try admin/admin");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-[hsl(var(--primary))] rounded-2xl flex items-center justify-center shadow-lg">
                        <Database className="w-8 h-8 text-[hsl(var(--primary-foreground))]" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold">India Data Hub</CardTitle>
                        <CardDescription className="text-base">
                            Sign in to access economic and financial data
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium">
                                Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>

                        <p className="text-xs text-center text-[hsl(var(--muted-foreground))]">
                            Demo: <span className="font-medium">admin / admin</span>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
