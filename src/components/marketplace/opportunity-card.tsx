import { ArrowUpRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Availability, Format, Photo } from "@mocks/types";
import { Badge } from "@/components/ui/badge";
import { capacityLabel, displayDate, formatLabel, money, rateUnit } from "@/lib/marketplace/format";
import { neighborhoods } from "@/lib/marketplace/search";
import type { Opportunity } from "@/lib/marketplace/store";

const formatStyles: Record<Format, string> = {
  placement: "bg-format-placement",
  popup: "bg-format-popup",
  prep: "bg-format-prep",
};

export function FormatBadge({ format }: { format: Format }) {
  return <Badge className={`min-h-7 px-3 text-[11px] text-foreground ${formatStyles[format]}`}>{formatLabel[format]}</Badge>;
}

export function MarketplacePhoto({ photo, sizes, preload }: { photo: Photo; sizes: string; preload?: boolean }) {
  return <Image src={photo.src} alt={photo.alt} fill preload={preload} sizes={sizes} className="object-cover" style={{ objectPosition: photo.position }} />;
}

export function OpportunityCard({ opportunity, window, query = "", preload }: {
  opportunity: Opportunity; window: Availability; query?: string; preload?: boolean;
}) {
  const { listing, venue } = opportunity;
  return (
    <Link href={`/opportunities/${listing.slug}${query}`} className="group block overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_0_color-mix(in_srgb,var(--crust)_28%,transparent)] transition hover:-translate-y-0.5 hover:border-input/50">
      <div className="relative aspect-[1.6] overflow-hidden bg-muted">
        <MarketplacePhoto photo={listing.photo} sizes="(min-width: 1280px) 390px, (min-width: 640px) 32vw, 100vw" preload={preload} />
        <div className="absolute top-3.5 left-3.5"><FormatBadge format={listing.format} /></div>
      </div>
      <div className="px-4 pt-3.5 pb-4 sm:px-3.5 lg:px-4.5">
        <h3 className="text-[1.1rem] leading-tight font-semibold tracking-[-0.04em]">{listing.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-[11px] lg:text-xs">{venue.name} <span aria-hidden="true">·</span> {neighborhoods[venue.neighborhood]}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-[11px] lg:text-xs">
          <CalendarDays size={14} className="shrink-0" aria-hidden="true" />
          <span><time dateTime={window.date}>{displayDate(window.date)}</time> · {capacityLabel(listing.format, window.capacity)}</span>
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
          <p className="text-sm"><strong className="font-semibold">{money(listing.rateCents)}</strong> <span className="text-xs text-muted-foreground">{rateUnit[listing.format]}</span></p>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-primary-hover transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
