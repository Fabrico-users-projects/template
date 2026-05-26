import React, { useState } from "react";
import { useFabrico } from "@fabrico/sdk/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function UserProfile({ afterSignOutUrl = "/" }: { afterSignOutUrl?: string }) {
  const { user, isLoaded, updateUser, signOut } = useFabrico();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If we haven't loaded the session state yet, show a loader
  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-sm border-border/50 bg-card">
        <CardContent className="flex justify-center items-center p-12">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // If there's no user, we shouldn't render the profile
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
    <Card className="w-full max-w-md mx-auto shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Profile Details</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shadow-inner">
            {user.image ? <img src={user.image} alt={user.name || ""} className="size-full rounded-full object-cover" /> : initial}
          </div>
          <div>
            <p className="font-medium text-lg">{user.name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="flex h-10 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            {success && <span className="text-sm font-medium text-emerald-500 animate-in fade-in">Changes saved!</span>}
          </div>
        </form>

        <div className="pt-6 border-t border-border/50">
          <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
            Sign out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
