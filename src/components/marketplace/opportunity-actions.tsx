"use client";

import { CalendarDays, FlaskConical, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Listing, Venue } from "@mocks/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capacityLabel, displayDate, money } from "@/lib/marketplace/format";
import { createRequest, switchRole } from "@/lib/marketplace/store";
import { useDemo } from "@/lib/marketplace/use-demo";

export function OpportunityActions({ listing, venueName, initialWindow }: { listing: Listing; venueName: Venue["name"]; initialWindow: string }) {
  const [windowId, setWindowId] = useState(initialWindow);
  const [quantity, setQuantity] = useState("10");
  const [crew, setCrew] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { role } = useDemo();
  const router = useRouter();
  const window = listing.windows.find(({ id }) => id === windowId) ?? listing.windows[0];
  const placement = listing.format === "placement";
  const crewCents = listing.format === "popup" && crew ? listing.crew.feeCents : 0;
  const units = placement ? Number(quantity) : 1;
  const estimated = (Number.isInteger(units) && units > 0 ? units : 0) * listing.rateCents + crewCents;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || listing.format !== "placement") return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    const result = await createRequest(listing.slug, window.id, {
      productName: String(data.get("product") ?? ""),
      source: String(data.get("source") ?? ""),
      quantity: Number(quantity),
      dropOff: listing.receiving,
    });
    if (result.ok) router.push(`/requests/${result.value}`);
    else {
      setError(result.error);
      setPending(false);
    }
  }

  async function becomeMaker() {
    const result = await switchRole("maker");
    setError(result.ok ? "" : result.error);
  }

  return (
    <section className="panel self-start" aria-labelledby="spot-action-title">
      <div className="mb-4 flex items-center gap-2 text-primary-hover">
        <FlaskConical size={15} aria-hidden="true" />
        <span className="text-xs font-semibold">{placement ? "Demo request" : "Demo estimate"}</span>
      </div>
      <h2 className="section-title" id="spot-action-title">{placement ? "Request this spot" : "Plan this spot"}</h2>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        <label className="grid gap-1.5 text-sm font-medium">
          Available date
          <select className="control" value={window.id} onChange={(event) => setWindowId(event.target.value)}>
            {listing.windows.map((option) => <option key={option.id} value={option.id}>{displayDate(option.date)}, {option.date.slice(0, 4)}</option>)}
          </select>
        </label>
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <CalendarDays size={15} className="shrink-0" aria-hidden="true" /> {window.hours} ET · {capacityLabel(listing.format, window.capacity)}
        </p>
        {listing.format === "placement" && role === "maker" && (
          <>
            <label className="grid gap-1.5 text-sm font-medium">
              Product
              <Input name="product" className="h-11" defaultValue="Cardamom shortbread" maxLength={100} required />
            </label>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3">
              <label className="grid gap-1.5 text-sm font-medium">
                Quantity
                <Input name="quantity" className="h-11" type="number" min={1} max={window.capacity} step={1} value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Drop-off
                <Input className="h-11 bg-muted" value={`${listing.receiving} ET`} readOnly />
              </label>
            </div>
            <label className="grid gap-1.5 text-sm font-medium">
              Production source
              <Input name="source" className="h-11" defaultValue="Registered home bakery (demo)" maxLength={160} required />
            </label>
          </>
        )}
        {listing.format === "popup" && (
          <label className="flex items-center gap-2 rounded-md border border-border bg-background p-3 text-sm">
            <input type="checkbox" checked={crew} onChange={(event) => setCrew(event.target.checked)} className="size-4 accent-primary" />
            {listing.crew.name} · {money(listing.crew.feeCents)}
          </label>
        )}
        <div className="rounded-md border border-border bg-background p-3.5">
          <div className="flex justify-between gap-2 text-sm text-muted-foreground">
            <span>{placement ? `${units || 0} × ${money(listing.rateCents)} wholesale` : "Base rate"}</span>
            <span>{money(estimated - crewCents)}</span>
          </div>
          {crewCents > 0 && <div className="mt-1 flex justify-between gap-2 text-sm text-muted-foreground"><span>Host crew</span><span>{money(crewCents)}</span></div>}
          <div className="mt-2.5 flex justify-between gap-2 border-t border-border pt-2.5 text-sm font-semibold">
            <span>Estimated total</span><span aria-live="polite">{money(estimated)}</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{placement ? `${venueName} pays the maker for accepted units.` : `The maker pays ${venueName}.`}</p>
        </div>
        {placement && role === "maker" && <Button type="submit" className="h-11" disabled={pending}><Send aria-hidden="true" /> {pending ? "Submitting…" : "Submit demo request"}</Button>}
        {placement && role === "host" && <Button type="button" className="h-11" onClick={() => void becomeMaker()}>Switch to demo maker</Button>}
        {!placement && <p className="text-xs leading-relaxed text-muted-foreground">Demo submissions are available for counter slots.</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>
    </section>
  );
}
