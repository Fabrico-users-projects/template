import { useState, useRef, useEffect } from "react";
import { useFabrico } from "@fabrico/sdk/react";
import { LogOut, User, Settings, Shield } from "lucide-react";

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
        className="group flex items-center justify-center size-9 rounded-full ring-2 ring-primary/10 hover:ring-primary/30 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md"
      >
        <div className="size-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm">
          {user.image ? (
            <img src={user.image} alt={user.name || "User"} className="size-full object-cover group-hover:scale-110 transition-transform duration-200" />
          ) : (
            <span className="group-hover:scale-110 transition-transform duration-200">{initial}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-card border border-border/40 shadow-2xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-4 border-b border-border/40 bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner shrink-0">
                {user.image ? <img src={user.image} alt="" className="size-full rounded-full object-cover" /> : initial}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{user.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => { /* Navigate to profile */ setIsOpen(false); }}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-all group"
            >
              <User className="mr-2.5 size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Manage account
            </button>
            <button
              onClick={() => { setIsOpen(false); }}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-all group"
            >
              <Settings className="mr-2.5 size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Settings
            </button>
          </div>
          <div className="p-1.5 pt-0 border-t border-border/40 mt-1.5 bg-muted/5">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-all group"
            >
              <LogOut className="mr-2.5 size-4 transition-transform group-hover:translate-x-0.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
