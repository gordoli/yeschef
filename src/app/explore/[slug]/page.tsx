import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, FlaskConical, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketplacePhoto } from "@/components/marketplace/opportunity-card";
import { Badge } from "@/components/ui/badge";
import { displayDate, money } from "@/lib/marketplace/format";
import { getAppearance } from "@/lib/marketplace/store";

export async function generateMetadata({ params }: PageProps<"/explore/[slug]">): Promise<Metadata> {
  const entry = getAppearance((await params).slug);
  return { title: entry ? `${entry.maker.name} at ${entry.venue.name}` : "Appearance" };
}

export default async function AppearancePage({ params }: PageProps<"/explore/[slug]">) {
  const entry = getAppearance((await params).slug);
  if (!entry) notFound();
  const { appearance, product, maker, venue } = entry;
  return (
    <div className="pt-6 sm:pt-8">
      <Link href="/explore" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary-hover hover:underline">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Explore food
      </Link>
      <div className="mt-2 mb-5 grid gap-2.5 sm:mb-7">
        <Badge className="min-h-7 bg-format-placement px-3 text-foreground">Guest goods</Badge>
        <h1 className="page-title">{maker.name} at {venue.name}</h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><FlaskConical size={15} aria-hidden="true" /> Confirmed demo appearance</p>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(17rem,1fr)] lg:gap-7">
        <div className="relative aspect-[1.55] overflow-hidden rounded-xl border border-border bg-muted">
          <MarketplacePhoto photo={appearance.photo} sizes="(min-width: 768px) 58vw, 100vw" preload />
        </div>
        <section className="panel" aria-labelledby="product-title">
          <h2 className="section-title" id="product-title">{product.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{appearance.description}</p>
          <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm">
            <p className="flex items-center gap-2"><CalendarDays size={16} className="shrink-0" aria-hidden="true" /> {displayDate(appearance.date)}, {appearance.date.slice(0, 4)} · {appearance.hours} ET</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="shrink-0" aria-hidden="true" /> {venue.address}</p>
          </div>
          <div className="mt-4 rounded-md border border-border bg-background p-3.5">
            <p className="text-sm font-semibold">{money(appearance.priceCents)} at the counter</p>
            <p className="mt-1 text-xs text-muted-foreground">{appearance.status === "sold-out" ? "Sold out" : "While supplies last"}</p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{product.allergens}</p>
        </section>
      </div>
    </div>
  );
}
