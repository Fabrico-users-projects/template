import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useFabrico } from "@fabrico/sdk/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Mail, ArrowRight } from "lucide-react";
import { GoogleIcon, DiscordIcon, GithubIcon } from "./Icons";

export function SignIn({ redirectTo = "/" }: { redirectTo?: string }) {
  const { user, isLoaded, client, config } = useFabrico();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      window.location.href = redirectTo;
    }
  }, [user, isLoaded, redirectTo]);

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex justify-center items-center p-24">
          <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (user) return null;

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
    <Card className="w-full max-w-md mx-auto shadow-2xl border-border/40 bg-card/95 backdrop-blur-md overflow-hidden ring-1 ring-white/10">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      <CardHeader className="space-y-1.5 pt-8 pb-6 px-8">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-base">
          {otpSent ? "Verification code sent to your email" : "Choose your preferred sign in method"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 px-8 pb-8">
        {!otpSent && (
          <div className="grid grid-cols-1 gap-3">
            {config?.githubEnabled && (
              <Button 
                variant="outline" 
                onClick={() => handleOAuth("github")} 
                className="w-full h-11 relative bg-background/50 hover:bg-accent transition-all duration-200 border-border/60"
              >
                <GithubIcon className="size-5 absolute left-4" />
                <span className="font-semibold">Continue with GitHub</span>
              </Button>
            )}
            {config?.googleEnabled && (
              <Button 
                variant="outline" 
                onClick={() => handleOAuth("google")} 
                className="w-full h-11 relative bg-background/50 hover:bg-accent transition-all duration-200 border-border/60"
              >
                <GoogleIcon className="size-5 absolute left-4" />
                <span className="font-semibold">Continue with Google</span>
              </Button>
            )}
            {config?.discordEnabled && (
              <Button 
                variant="outline" 
                onClick={() => handleOAuth("discord")} 
                className="w-full h-11 relative bg-background/50 hover:bg-accent transition-all duration-200 border-border/60"
              >
                <DiscordIcon className="size-5 absolute left-4 text-[#5865F2]" />
                <span className="font-semibold">Continue with Discord</span>
              </Button>
            )}
          </div>
        )}
        
        {!otpSent && (config?.githubEnabled || config?.googleEnabled || config?.discordEnabled) && config?.emailOtpEnabled && (
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-card px-3 text-muted-foreground/60">Or continue with</span>
            </div>
          </div>
        )}

        {config?.emailOtpEnabled && !otpSent && (
          <form onSubmit={handleSendOtp} className="grid gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 size-4.5 text-muted-foreground/50" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-border/60 bg-background/50 pl-10 pr-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:opacity-50"
                required
              />
            </div>
            {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive text-center animate-in fade-in slide-in-from-top-1">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full h-11 font-bold shadow-lg shadow-primary/20 group">
              {loading ? "Sending code..." : (
                <>
                  <span>Continue with Email</span>
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        )}

        {config?.emailOtpEnabled && otpSent && (
          <form onSubmit={handleVerifyOtp} className="grid gap-6">
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
                autoFocus
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot 
                      key={i} 
                      index={i} 
                      className="size-11 rounded-lg border-border/60 bg-background/50 font-bold text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="text-sm text-muted-foreground">
                Sent to <span className="font-semibold text-foreground">{email}</span>
              </div>
            </div>
            {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive text-center animate-in fade-in slide-in-from-top-1">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full h-11 font-bold shadow-lg shadow-primary/20">
              {loading ? "Verifying..." : "Verify Identity"}
            </Button>
            <button 
              type="button" 
              onClick={() => setOtpSent(false)} 
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider text-center"
            >
              ← Use a different email
            </button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}


