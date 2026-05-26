import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useFabrico } from "@fabrico/sdk/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export function SignIn({ redirectTo = "/" }: { redirectTo?: string }) {
  const { user, isLoaded, client, config } = useFabrico();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clerk-like fetching first: if already logged in, redirect immediately
  useEffect(() => {
    if (isLoaded && user) {
      window.location.href = redirectTo;
    }
  }, [user, isLoaded, redirectTo]);

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-sm border-border/50 bg-card">
        <CardContent className="flex justify-center items-center p-12">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (user) {
    return null; // Don't flash the form while redirecting
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      await client.auth.sendOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setError("");
    setLoading(true);
    try {
      await client.auth.verifyOtp(email, code);
      // Let the useEffect handle the redirect once the state updates, or force it:
      window.location.href = redirectTo;
    } catch (err: any) {
      setError(err.message || "Invalid code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "github" | "google" | "discord") => {
    client.auth.signInOAuth(provider, { redirectTo });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm border-border/50 bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Sign in
        </CardTitle>
        <CardDescription className="text-center">
          {otpSent ? "Enter the verification code sent to your email" : "Choose your preferred sign in method"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {config?.githubEnabled && (
          <Button variant="outline" onClick={() => handleOAuth("github")} className="w-full">
            Continue with GitHub
          </Button>
        )}
        {config?.googleEnabled && (
          <Button variant="outline" onClick={() => handleOAuth("google")} className="w-full">
            Continue with Google
          </Button>
        )}
        
        {(config?.githubEnabled || config?.googleEnabled || config?.discordEnabled) && config?.emailOtpEnabled && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>
        )}

        {config?.emailOtpEnabled && !otpSent && (
          <form onSubmit={handleSendOtp} className="grid gap-4">
            <div className="grid gap-2">
              <input
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending code..." : "Sign In with Email"}
            </Button>
          </form>
        )}

        {config?.emailOtpEnabled && otpSent && (
          <form onSubmit={handleVerifyOtp} className="grid gap-4">
            <div className="flex justify-center py-2">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOtpSent(false)} className="text-xs text-muted-foreground">
              Use a different email
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}


