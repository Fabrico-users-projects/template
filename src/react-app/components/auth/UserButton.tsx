import React, { useState, useRef, useEffect } from "react";
import { useFabrico } from "@fabrico/sdk/react";

export function UserButton({ afterSignOutUrl = "/" }: { afterSignOutUrl?: string }) {
  const { user, isLoaded, signOut } = useFabrico();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded || !user) return null;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = afterSignOutUrl;
  };

  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-hidden shadow-sm transition-transform hover:scale-105"
      >
        {user.image ? <img src={user.image} alt={user.name || "User"} className="size-full object-cover" /> : initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-card border border-border/50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
            <p className="text-sm font-medium text-foreground truncate">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="p-1">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-sm transition-colors font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
