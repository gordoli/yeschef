"use client";

import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ClipboardList, FlaskConical, Inbox, Send } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import type { DemoRole, PlacementRequest, RequestStatus, TermsRevision } from "@mocks/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { displayDate, money } from "@/lib/marketplace/format";
import { acceptOffer, demoAccounts, getRequestContext, getRequests, getRequestStatus, sendOffer, switchRole } from "@/lib/marketplace/store";
import { useDemo } from "@/lib/marketplace/use-demo";

const requestPaths: Record<DemoRole, string> = { maker: "/requests", host: "/host/requests" };

const statuses: Record<RequestStatus, { label: string; classes: string }> = {
  requested: { label: "Requested", classes: "bg-muted" },
  offered: { label: "Offer sent", classes: "bg-secondary" },
  accepted: { label: "Accepted · review pending", classes: "bg-accent" },
};

function StatusBadge({ request }: { request: PlacementRequest }) {
  const { label, classes } = statuses[getRequestStatus(request)];
  return <Badge className={`min-h-7 px-2.5 text-[11px] text-foreground ${classes}`}>{label}</Badge>;
}

export function RoleGate({ role, children }: { role: DemoRole; children: ReactNode }) {
  const demo = useDemo();
  const [error, setError] = useState("");
  if (demo.role === role) return children;

  async function change() {
    const result = await switchRole(role);
    setError(result.ok ? "" : result.error);
  }

  return (
    <div className="panel max-w-lg">
      <h2 className="section-title">Switch demo role</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Open this workspace as {role === "maker" ? demoAccounts.maker.actor.name : demoAccounts.host.organization.name}.</p>
      <Button className="mt-4 h-11" onClick={() => void change()}><FlaskConical aria-hidden="true" /> Switch to demo {role}</Button>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function RequestList({ role }: { role: DemoRole }) {
  const demo = useDemo();
  const requests = getRequests(demo);

  if (!requests.length) return (
    <div className="panel py-9 text-center">
      <Inbox className="mx-auto mb-3 text-primary-hover" size={30} aria-hidden="true" />
      <h2 className="text-lg font-semibold">{role === "host" ? "No incoming requests yet" : "No requests yet"}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {role === "host" ? "When Mina proposes a batch at Juniper Café, her request appears here." : "Find a counter slot and propose a batch to get started."}
      </p>
      {role === "maker" && <Button asChild className="mt-4 h-11"><Link href="/">Find a spot <ArrowRight aria-hidden="true" /></Link></Button>}
    </div>
  );

  return (
    <ul className="overflow-hidden rounded-xl border border-border bg-card">
      {requests.map((request) => {
        const { maker, venue, window } = getRequestContext(request);
        const total = request.offer?.terms.totalCents ?? request.estimatedUnitCents * request.proposal.quantity;
        return (
          <li key={request.id} className="border-b border-border last:border-b-0">
            <Link href={`${requestPaths[role]}/${request.id}`} className="group grid gap-3 p-4 focus-visible:-outline-offset-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
              <div className="min-w-0">
                <h2 className="font-semibold break-words group-hover:text-primary-hover">{request.proposal.productName}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{role === "host" ? maker.name : venue.name} · {displayDate(window.date)} · {request.proposal.quantity} units</p>
                <p className="mt-1 text-xs font-medium">{money(total)} wholesale {request.offer ? "offer" : "estimate"}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge request={request} />
                <ArrowRight className="size-4 text-primary-hover" aria-hidden="true" />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return <div><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1 text-sm leading-relaxed break-words">{children}</dd></div>;
}

function OfferTerms({ terms }: { terms: TermsRevision }) {
  return (
    <section className="panel" aria-labelledby="offer-terms">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="section-title" id="offer-terms">Wholesale offer</h2>
        <Badge variant="outline" className="min-h-7 px-2.5">Revision {terms.revision}</Badge>
      </div>
      <div className="my-4 rounded-md border border-border bg-background p-4">
        <p className="text-xs font-medium text-muted-foreground">Wholesale total</p>
        <p className="mt-0.5 text-3xl font-semibold tracking-tight">{money(terms.totalCents)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{terms.quantity} units × {money(terms.unitCents)} per accepted unit</p>
        <p className="mt-2 text-sm font-semibold">{terms.payer} pays {terms.payee}.</p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <DetailItem label="Product">{terms.productName}</DetailItem>
        <DetailItem label="Date">{displayDate(terms.date)}, {terms.date.slice(0, 4)}</DetailItem>
        <DetailItem label="Drop-off">{terms.dropOff} ET</DetailItem>
        <DetailItem label="Display window">{terms.displayHours} ET</DetailItem>
        <DetailItem label="Payment">{terms.payment}</DetailItem>
        <DetailItem label="Handoff">{terms.handoff}</DetailItem>
      </dl>
    </section>
  );
}

function RequestAction({ request, role }: { request: PlacementRequest; role: DemoRole }) {
  const [price, setPrice] = useState((request.estimatedUnitCents / 100).toFixed(2));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const status = getRequestStatus(request);
  const offer = request.offer;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const result = role === "host"
      ? await sendOffer(request.id, Math.round(Number(price) * 100))
      : await acceptOffer(request.id, offer?.terms.revision ?? 0);
    if (!result.ok) setError(result.error);
    setPending(false);
  }

  if (status === "accepted") return (
    <section className="rounded-xl border border-border bg-accent p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold"><CheckCircle2 size={18} className="shrink-0" aria-hidden="true" /> Accepted · review pending</h2>
      <p className="mt-2 text-sm leading-relaxed">Both sides accepted revision {offer?.terms.revision}. The request is awaiting operations review before confirmation.</p>
    </section>
  );

  const isComposing = role === "host" && status === "requested";
  const isResponding = role === "maker" && status === "offered";
  if (!isComposing && !isResponding) return (
    <section className="panel">
      <h2 className="text-base font-semibold">{role === "maker" ? "Waiting for Juniper Café" : "Waiting for Mina Park"}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{role === "maker" ? "The host can review your proposal and send a wholesale offer." : "Mina can review and accept the offer in My requests."}</p>
    </section>
  );

  return (
    <form onSubmit={submit} className="panel grid gap-4">
      <p className="flex items-center gap-2 text-xs font-semibold text-primary-hover"><FlaskConical size={15} aria-hidden="true" /> Demo action</p>
      <h2 className="section-title">{isComposing ? "Send a wholesale offer" : "Respond to offer"}</h2>
      {isComposing ? (
        <>
          <label className="grid gap-1.5 text-sm font-medium">
            Price per accepted unit ($)
            <Input className="h-11" type="number" min="0.01" max="1000" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required />
          </label>
          <p className="text-sm text-muted-foreground">{request.proposal.quantity} units · <strong className="font-semibold text-foreground">{money(Math.round(Number(price) * 100) * request.proposal.quantity)}</strong> wholesale total</p>
        </>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">Accept revision {offer?.terms.revision} for {money(offer?.terms.totalCents ?? 0)} wholesale. The request moves to operations review.</p>
      )}
      <Button type="submit" className="h-11" disabled={pending}>
        {isComposing ? <Send aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
        {pending ? "Saving…" : isComposing ? "Send demo offer" : "Accept demo offer"}
      </Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </form>
  );
}

export function RequestDetail({ id, role }: { id: string; role: DemoRole }) {
  const demo = useDemo();
  const request = getRequests(demo).find((entry) => entry.id === id);

  return (
    <div className="pt-6 sm:pt-8">
      <Link href={requestPaths[role]} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary-hover hover:underline">
        <ArrowLeft size={16} aria-hidden="true" /> {role === "maker" ? "Back to my requests" : "Back to incoming requests"}
      </Link>
      <RoleGate role={role}>
        {request ? <RequestContent key={request.id} request={request} role={role} /> : (
          <div className="panel mt-3">
            <h1 className="section-title">Request unavailable</h1>
            <p className="mt-2 text-sm text-muted-foreground">Open a request from this browser’s demo workspace.</p>
          </div>
        )}
      </RoleGate>
    </div>
  );
}

function RequestContent({ request, role }: { request: PlacementRequest; role: DemoRole }) {
  const { listing, venue, maker, window } = getRequestContext(request);
  const { proposal, offer } = request;
  return (
    <>
      <div className="mt-2 mb-5 grid gap-2.5 sm:mb-7">
        <StatusBadge request={request} />
        <h1 className="page-title break-words">{proposal.productName}</h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays size={16} className="shrink-0" aria-hidden="true" /> {venue.name} · {displayDate(window.date)}, {window.date.slice(0, 4)}</p>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1.5fr)_minmax(17rem,1fr)] lg:gap-7">
        {offer && <OfferTerms terms={offer.terms} />}
        <div className="md:col-start-2 md:row-start-1 md:row-span-2">
          <RequestAction request={request} role={role} />
        </div>
        <div className={offer ? "md:col-start-1" : "-order-1"}>
          <section className="panel" aria-labelledby="proposal-title">
            <h2 id="proposal-title" className="section-title flex items-center gap-2"><ClipboardList size={20} aria-hidden="true" /> Batch proposal</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <DetailItem label="Maker">{maker.name}</DetailItem>
              <DetailItem label="Opportunity">{listing.title}</DetailItem>
              <DetailItem label="Quantity">{proposal.quantity} packaged units</DetailItem>
              <DetailItem label="Production source">{proposal.source}</DetailItem>
              <DetailItem label="Drop-off">{proposal.dropOff} ET</DetailItem>
              <DetailItem label="Original estimate">{money(proposal.quantity * request.estimatedUnitCents)} wholesale</DetailItem>
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
