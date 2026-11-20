"use client";

import { ChefHat, ChevronDown, FlaskConical, Store, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { DemoRole } from "@mocks/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { demoAccounts, switchRole } from "@/lib/marketplace/store";
import { useDemo } from "@/lib/marketplace/use-demo";

export function Header() {
  const { role } = useDemo();
  const pathname = usePathname();
  const router = useRouter();
  const [error, setError] = useState("");

  async function changeRole(next: DemoRole) {
    setError("");
    const result = await switchRole(next);
    if (!result.ok) return setError(result.error);
    if (next === "host") router.push("/host/requests");
    else if (pathname.startsWith("/host")) router.push("/requests");
  }

  const links = [
    { href: "/", label: "Find a spot", active: pathname === "/" || pathname.startsWith("/opportunities/") },
    { href: "/explore", label: "Explore food", active: pathname.startsWith("/explore") },
    { href: "/requests", label: "My requests", active: pathname.startsWith("/requests") },
    { href: "/host/requests", label: "Host workspace", active: pathname.startsWith("/host") },
  ];

  return (
    <header className="border-b border-border">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-3">Skip to content</a>
      <div className="site-width grid grid-cols-[1fr_auto] items-center gap-x-3 sm:grid-cols-[auto_1fr_auto] lg:gap-x-8">
        <Link href="/" className="my-3 inline-flex w-fit items-center gap-2.5 text-[1.45rem] font-semibold tracking-[-0.07em] text-primary-hover">
          <span className="grid size-9 place-items-center rounded-[10px] bg-primary text-primary-foreground">
            <ChefHat size={22} strokeWidth={1.8} aria-hidden="true" />
          </span>
          YesChef
        </Link>
        <nav aria-label="Main navigation" className="col-span-2 row-start-2 flex flex-wrap items-stretch justify-between gap-x-2.5 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-center sm:gap-x-4 lg:gap-x-7">
          {links.map(({ href, label, active }) => (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className="nav-link relative inline-flex min-h-11 items-center whitespace-nowrap text-[11px] font-medium text-muted-foreground hover:text-primary-hover sm:min-h-[66px] sm:text-xs lg:text-sm">
              {label}
            </Link>
          ))}
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="col-start-2 row-start-1 h-10 rounded-full bg-card px-2.5 sm:col-start-3 sm:px-3" aria-label={`Demo ${role}, switch demo role`}>
              <FlaskConical className="text-primary-hover" aria-hidden="true" />
              <span className="text-xs font-medium">Demo <span className="capitalize">{role}</span></span>
              <ChevronDown className="size-3! text-muted-foreground" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-55">
            <DropdownMenuLabel>Simulated roles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void changeRole("maker")} className="min-h-10">
              <UserRound aria-hidden="true" />
              Maker · {demoAccounts.maker.actor.name}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void changeRole("host")} className="min-h-10">
              <Store aria-hidden="true" />
              Host · {demoAccounts.host.organization.name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {error && <p role="alert" className="site-width pb-2 text-sm text-destructive">{error}</p>}
    </header>
  );
}
