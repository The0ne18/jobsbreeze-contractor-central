
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function Layout({ children, title, className }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <main className={cn("p-4 md:p-6", className)}>
          {title && (
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
