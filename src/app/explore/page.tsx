import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { MarketplacePhoto } from "@/components/marketplace/opportunity-card";
import { Badge } from "@/components/ui/badge";
import { displayDate, money } from "@/lib/marketplace/format";
import { neighborhoods } from "@/lib/marketplace/search";
import { getPublicGuide } from "@/lib/marketplace/store";

export const metadata: Metadata = { title: "Explore food" };

export default function ExplorePage() {
  const guide = getPublicGuide();
  return (
    <div className="pt-8 sm:pt-11">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="page-title">Explore food<span className="text-primary">.</span></h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">See what local makers are serving at Brooklyn cafés and kitchens.</p>
        </div>
        <div className="checker mb-2 hidden h-5.5 w-22 sm:block" aria-hidden="true" />
      </div>
      <section aria-labelledby="guide-title">
        <h2 id="guide-title" className="section-title mb-4">On the counter</h2>
        <div className="grid gap-4">
          {guide.map(({ appearance, maker, product, venue }) => (
            <Link key={appearance.slug} href={`/explore/${appearance.slug}`} className="group grid max-w-4xl overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-[1fr_1.12fr]">
              <div className="relative aspect-[1.6] overflow-hidden bg-muted sm:aspect-auto sm:min-h-65">
                <MarketplacePhoto photo={appearance.photo} sizes="(min-width: 900px) 435px, (min-width: 640px) 50vw, 100vw" preload />
              </div>
              <div className="p-5 sm:self-center sm:p-7">
                <Badge className="min-h-7 bg-format-placement px-3 text-foreground">Guest goods</Badge>
                <h3 className="section-title mt-3 group-hover:text-primary-hover">{product.name}</h3>
                <p className="mt-1 text-sm font-medium">{maker.name} at {venue.name}</p>
                <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2"><CalendarDays size={15} aria-hidden="true" /> {displayDate(appearance.date)} · {appearance.hours} ET</span>
                  <span className="flex items-center gap-2"><MapPin size={15} aria-hidden="true" /> {neighborhoods[venue.neighborhood]}, Brooklyn</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm font-semibold">
                  {money(appearance.priceCents)} at the counter
                  <span className="grid size-8 place-items-center rounded-full border border-border text-primary-hover group-hover:bg-primary group-hover:text-primary-foreground"><ArrowUpRight size={16} aria-hidden="true" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
