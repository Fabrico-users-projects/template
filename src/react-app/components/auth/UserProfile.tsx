import React, { useState } from "react";
import { useFabrico } from "@fabrico/sdk/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { User, Mail, Save, LogOut, CheckCircle2 } from "lucide-react";

export function UserProfile({ afterSignOutUrl = "/" }: { afterSignOutUrl?: string }) {
  const { user, isLoaded, updateUser, signOut } = useFabrico();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex justify-center items-center p-24">
          <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updateUser({ name });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = afterSignOutUrl;
  };

  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl border-border/40 bg-card/95 backdrop-blur-md overflow-hidden ring-1 ring-white/10">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      <CardHeader className="space-y-1.5 pt-8 pb-6 px-8 text-center sm:text-left">
        <CardTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Profile Settings
        </CardTitle>
        <CardDescription className="text-base font-medium">
          Manage your account information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-muted/30 border border-border/40 backdrop-blur-sm">
          <div className="size-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-4xl font-black text-primary-foreground shadow-2xl ring-4 ring-primary/10">
            {user.image ? <img src={user.image} alt="" className="size-full rounded-full object-cover" /> : initial}
          </div>
          <div className="flex flex-col items-center sm:items-start min-w-0">
            <h3 className="font-extrabold text-2xl truncate max-w-full">{user.name || "Unnamed User"}</h3>
            <div className="flex items-center text-muted-foreground font-medium mt-1">
              <Mail className="size-3.5 mr-2" />
              <span className="truncate text-sm">{user.email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2.5">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <User className="size-3.5" />
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="flex h-12 w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 shadow-sm"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto h-11 px-8 font-bold shadow-lg shadow-primary/20 group">
              {loading ? (
                "Saving Changes..."
              ) : (
                <>
                  <Save className="mr-2 size-4 transition-transform group-hover:scale-110" />
                  Save Changes
                </>
              )}
            </Button>
            {success && (
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-500 animate-in fade-in zoom-in-95 duration-200 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="size-4" />
                Changes saved successfully
              </div>
            )}
          </div>
        </form>

        <div className="pt-8 border-t border-border/40">
          <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
            <h4 className="text-sm font-bold uppercase tracking-widest text-destructive mb-4">Danger Zone</h4>
            <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto h-11 px-8 font-bold shadow-lg shadow-destructive/20 group">
              <LogOut className="mr-2 size-4 transition-transform group-hover:-translate-x-0.5" />
              Sign out from this device
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
