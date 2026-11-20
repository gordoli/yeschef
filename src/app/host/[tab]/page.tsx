import type { Metadata } from "next";
import { CalendarDays, FlaskConical, Store } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OpportunityCard } from "@/components/marketplace/opportunity-card";
import { RequestList, RoleGate } from "@/components/marketplace/request-views";
import { displayDate } from "@/lib/marketplace/format";
import { demoAccounts, getHostOpportunities } from "@/lib/marketplace/store";

export const metadata: Metadata = { title: "Host workspace" };

const tabs = { listings: "Listings", requests: "Requests", calendar: "Calendar" };

export default async function HostPage({ params }: PageProps<"/host/[tab]">) {
  const { tab } = await params;
  if (!Object.hasOwn(tabs, tab)) notFound();
  const opportunities = getHostOpportunities();

  return (
    <div className="pt-7 sm:pt-9">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-secondary px-5 py-5 sm:px-7">
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs font-medium"><Store size={15} aria-hidden="true" /> Host workspace</p>
          <h1 className="page-title">{demoAccounts.host.organization.name}</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-input/40 bg-card px-3 py-2 text-xs font-medium">
          <FlaskConical size={15} className="text-primary-hover" aria-hidden="true" /> Demo venue
        </span>
      </div>
      <RoleGate role="host">
        <nav aria-label="Host workspace" className="my-5 flex flex-wrap gap-2 border-b border-border pb-4">
          {Object.entries(tabs).map(([id, label]) => (
            <Link key={id} href={`/host/${id}`} aria-current={id === tab ? "page" : undefined} className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium ${id === tab ? "border-foreground bg-foreground text-background" : "border-input bg-card hover:bg-muted"}`}>
              {label}
            </Link>
          ))}
        </nav>
        {tab === "requests" && (
          <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)]">
            <section aria-labelledby="incoming">
              <h2 id="incoming" className="section-title mb-3.5">Incoming requests</h2>
              <RequestList role="host" />
            </section>
            <section aria-labelledby="host-listing">
              <h2 id="host-listing" className="section-title mb-3.5">Your counter slot</h2>
              {opportunities.map((entry) => <OpportunityCard key={entry.listing.slug} opportunity={entry} window={entry.listing.windows[0]} />)}
            </section>
          </div>
        )}
        {tab === "listings" && (
          <section aria-labelledby="host-listings">
            <h2 id="host-listings" className="section-title mb-3.5">Your listings</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((entry) => <OpportunityCard key={entry.listing.slug} opportunity={entry} window={entry.listing.windows[0]} />)}
            </div>
          </section>
        )}
        {tab === "calendar" && (
          <section aria-labelledby="host-calendar">
            <h2 id="host-calendar" className="section-title mb-3.5">Available windows</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {opportunities.flatMap(({ listing }) => listing.windows.map((window) => (
                <li className="panel" key={window.id}>
                  <p className="flex items-center gap-2 font-semibold"><CalendarDays size={17} aria-hidden="true" /> {displayDate(window.date)}, {window.date.slice(0, 4)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{listing.title} · {window.hours} ET · {window.capacity} units</p>
                </li>
              )))}
            </ul>
          </section>
        )}
      </RoleGate>
    </div>
  );
}
