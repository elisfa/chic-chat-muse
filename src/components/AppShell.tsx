import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import mark from "@/assets/chiti-mark.png";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Chat" },
  { to: "/journal", label: "Journal" },
  { to: "/taste", label: "Taste" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 sm:px-8">
      <header className="flex items-center justify-between gap-4 border-b border-hairline py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={mark} alt="" className="h-5 w-5 opacity-90" />
          <span className="text-sm font-medium tracking-[0.34em] uppercase">Chiti</span>
        </Link>
        <span className="label-xs hidden text-muted-foreground sm:block">
          personal styling index
        </span>
      </header>

      <nav className="sticky top-0 z-20 -mx-5 bg-background/85 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex w-full gap-1 rounded-full border border-hairline p-1">
          {tabs.map((tab) => {
            const active = pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "label-xs flex-1 rounded-full px-3 py-2.5 text-center transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="flex min-h-0 flex-1 flex-col pb-8">{children}</main>
    </div>
  );
}
