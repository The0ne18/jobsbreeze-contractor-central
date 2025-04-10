
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

import {
  Home,
  Users,
  FileText,
  Receipt,
  Settings,
  Menu,
  X,
  LogOut,
  Package,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Estimates",
    href: "/estimates",
    icon: FileText,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: Receipt,
  },
  {
    title: "Items",
    href: "/items",
    icon: Package,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { signOut, user } = useAuth();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isMobile]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3 z-50 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}

      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-slate-900 p-4 text-white transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-6 h-full">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xl font-bold">JobsBreeze</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  location.pathname === item.href
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
            <div className="px-3 py-2 text-xs text-white/70">
              Signed in as:
              <div className="font-medium text-sm truncate text-white">
                {user?.email}
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white px-3"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
