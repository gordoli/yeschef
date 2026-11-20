import { ChefHat, MapPin, SearchX, Sparkles } from "lucide-react";
import Link from "next/link";
import { OpportunityCard } from "@/components/marketplace/opportunity-card";
import { SearchForm } from "@/components/marketplace/search-form";
import { Button } from "@/components/ui/button";
import { filterQuery, readFilters } from "@/lib/marketplace/search";
import { findOpportunities } from "@/lib/marketplace/store";

export default async function Home({ searchParams }: PageProps<"/">) {
  const filters = readFilters(await searchParams);
  const query = filterQuery(filters);
  const results = findOpportunities(filters);

  return (
    <>
      <section aria-labelledby="find-title" className="relative pt-7 pb-5 sm:pt-9 sm:pb-6 lg:pt-11 lg:pb-7">
        <div className="relative z-10 flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-semibold tracking-[0.13em] text-primary-hover uppercase">
          <MapPin size={12} aria-hidden="true" /> Brooklyn, NY
        </div>
        <h1 id="find-title" className="page-title relative z-10 mt-3">Find a spot<span className="text-primary">.</span></h1>
        <p className="relative z-10 mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:max-w-[calc(100%-14rem)] sm:text-base">
          Find a prep kitchen, a room to pop up in, or a counter for your next batch.
        </p>
        <div aria-hidden="true" className="pointer-events-none absolute top-8 right-4 hidden h-32 w-48 sm:block lg:right-9 lg:h-36 lg:w-56">
          <div className="checker absolute right-1 bottom-4 h-5.5 w-40 -rotate-8 opacity-80 lg:w-48" />
          <div className="absolute top-1 right-9 grid size-26 -rotate-12 place-items-center rounded-full border border-primary/50 bg-secondary text-primary-hover shadow-[3px_4px_0_var(--poppy)] lg:size-30">
            <div className="grid size-[87%] place-items-center rounded-full border border-dashed border-primary/55">
              <ChefHat className="size-13 lg:size-15" strokeWidth={1.3} />
            </div>
          </div>
          <Sparkles className="absolute top-4 right-0 size-6 text-primary" strokeWidth={1.4} />
        </div>
      </section>
      <SearchForm filters={filters} />
      <section aria-labelledby="results-title" className="mt-5 sm:mt-6">
        <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-2 sm:mb-4">
          <h2 className="section-title" id="results-title">Available in Brooklyn</h2>
          <p aria-live="polite" className="text-xs font-medium text-muted-foreground">{results.length} {results.length === 1 ? "spot" : "spots"}</p>
        </div>
        {results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3 lg:gap-5">
            {results.map(({ matchingWindows, ...opportunity }, index) =>
              <OpportunityCard key={opportunity.listing.slug} opportunity={opportunity} window={matchingWindows[0]} query={query} preload={index === 0} />,
            )}
          </div>
        ) : (
          <div className="panel flex flex-col items-center gap-2 py-10 text-center">
            <SearchX size={28} className="mb-2 text-primary-hover" aria-hidden="true" />
            <h3 className="font-semibold">No spots match these filters</h3>
            <p className="text-sm text-muted-foreground">Try a wider date range or clear the filters to see all spots.</p>
            <Button asChild variant="outline" className="mt-3"><Link href="/">Clear filters</Link></Button>
          </div>
        )}
      </section>
    </>
  );
}
