import { ArrowLeft, Clock3, MapPin, PackageCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OpportunityActions } from "@/components/marketplace/opportunity-actions";
import { FormatBadge, MarketplacePhoto } from "@/components/marketplace/opportunity-card";
import { money, rateUnit } from "@/lib/marketplace/format";
import { filterQuery, foodTypes, neighborhoods, readFilters } from "@/lib/marketplace/search";
import { getOpportunity } from "@/lib/marketplace/store";

export default async function OpportunityPage({ params, searchParams }: PageProps<"/opportunities/[slug]">) {
  const { slug } = await params;
  const opportunity = getOpportunity(slug);
  if (!opportunity) notFound();
  const { listing, venue } = opportunity;
  const filters = readFilters(await searchParams);
  const initialWindow = listing.windows.find(({ date }) =>
    (!filters.from || date >= filters.from) && (!filters.through || date <= filters.through),
  ) ?? listing.windows[0];

  return (
    <div className="pt-6 sm:pt-8">
      <Link href={`/${filterQuery(filters)}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary-hover hover:underline">
        <ArrowLeft size={16} aria-hidden="true" /> Back to spots
      </Link>
      <div className="mt-2 mb-5 grid gap-2.5 sm:mb-7">
        <FormatBadge format={listing.format} />
        <h1 className="page-title">{listing.title}</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={16} className="shrink-0" aria-hidden="true" /> {venue.name} · {neighborhoods[venue.neighborhood]}, Brooklyn</p>
      </div>
      <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)] lg:gap-7">
        <div>
          <div className="relative aspect-[1.55] overflow-hidden rounded-xl border border-border bg-muted">
            <MarketplacePhoto photo={listing.photo} sizes="(min-width: 768px) 60vw, 100vw" preload />
          </div>
          <section className="mt-6" aria-labelledby="about-spot">
            <h2 id="about-spot" className="section-title">About this spot</h2>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div className="panel">
                <h3 className="flex items-center gap-2 font-semibold"><PackageCheck size={16} aria-hidden="true" /> Included</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{listing.resources.map(({ name }) => name).join(" · ")}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{listing.foodTypes.map((type) => foodTypes[type]).join(" · ")}</p>
              </div>
              <div className="panel">
                <h3 className="flex items-center gap-2 font-semibold"><Clock3 size={16} aria-hidden="true" /> Schedule and rate</h3>
                <p className="mt-2 font-medium">{money(listing.rateCents)} <span className="font-normal text-muted-foreground">{rateUnit[listing.format]}</span></p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {listing.format === "placement" && `Drop-off ${listing.receiving} · Display ${initialWindow.hours} ET`}
                  {listing.format === "popup" && `Prep ${listing.access} · Service ${initialWindow.hours} · Cleanup by ${listing.cleanup} ET`}
                  {listing.format === "prep" && `${initialWindow.hours} ET · Production only`}
                </p>
              </div>
            </div>
          </section>
        </div>
        <OpportunityActions listing={listing} venueName={venue.name} initialWindow={initialWindow.id} />
      </div>
    </div>
  );
}
