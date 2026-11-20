"use client";

import { CookingPot, LayoutGrid, Search, SlidersHorizontal, Store, Utensils, Wheat } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { filterQuery, foodTypes, formats, invalidDateRange, neighborhoods, readFilters, venueTypes, type Filters } from "@/lib/marketplace/search";

const chipIcons = { "": LayoutGrid, placement: Store, popup: Utensils, prep: Wheat };

function SearchField({ label, name, children }: { label: string; name: keyof Filters; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col rounded-md border border-border px-2.5 pt-2 pb-1.5 focus-within:border-ring md:rounded-none md:border-y-0 md:border-r md:border-l-0 md:px-4">
      <label htmlFor={"search-" + name} className="text-[11px] font-semibold md:text-xs">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "h-8 w-full min-w-0 rounded-none bg-transparent text-base text-muted-foreground md:text-sm";

export function SearchForm({ filters }: { filters: Filters }) {
  const router = useRouter();
  const query = filterQuery(filters);
  const [previousQuery, setPreviousQuery] = useState(query);
  const [error, setError] = useState(invalidDateRange(filters) ? "Available through must be on or after Available from." : "");
  const [draft, setDraft] = useState(filters);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (query !== previousQuery) {
    setPreviousQuery(query);
    setDraft(filters);
    setError(invalidDateRange(filters) ? "Available through must be on or after Available from." : "");
  }

  function apply(next: Filters) {
    if (invalidDateRange(next)) {
      setError("Available through must be on or after Available from.");
      return;
    }
    setError("");
    setDraft(next);
    setSheetOpen(false);
    router.push(`/${filterQuery(next)}`, { scroll: false });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    apply(draft);
  }

  function change(name: keyof Filters, value: string) {
    setDraft(readFilters({ ...draft, [name]: value }));
  }

  return (
    <>
      <form aria-label="Search spots" onSubmit={submit} className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-2.5 shadow-[0_3px_0_color-mix(in_srgb,var(--crust)_38%,transparent)] md:grid-cols-[1fr_1.16fr_1fr_1fr_auto] md:items-center md:gap-0 md:p-2.5">
        <SearchField label="Venue type" name="venue">
          <select className={inputClass} id="search-venue" name="venue" value={draft.venue} onChange={(event) => change("venue", event.target.value)}>
            <option value="">Any venue</option>
            {Object.entries(venueTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </SearchField>
        <SearchField label="What are you making?" name="food">
          <select className={inputClass} id="search-food" name="food" value={draft.food} onChange={(event) => change("food", event.target.value)}>
            <option value="">Any food</option>
            {Object.entries(foodTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </SearchField>
        <SearchField label="Available from" name="from">
          <input className={inputClass} id="search-from" name="from" type="date" value={draft.from} aria-invalid={Boolean(error)} aria-describedby={error ? "date-range-error" : undefined} onChange={(event) => change("from", event.target.value)} />
        </SearchField>
        <SearchField label="Available through" name="through">
          <input className={inputClass} id="search-through" name="through" type="date" value={draft.through} aria-invalid={Boolean(error)} aria-describedby={error ? "date-range-error" : undefined} onChange={(event) => change("through", event.target.value)} />
        </SearchField>
        <Button type="submit" className="col-span-2 h-11 rounded-md sm:h-12 md:col-span-1 md:ml-2.5 lg:px-5">
          <Search aria-hidden="true" /> Find spots
        </Button>
      </form>
      {error && <p id="date-range-error" className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5 sm:mt-6">
        <div role="group" aria-label="Spot format" className="flex flex-wrap gap-2">
          {(["", "placement", "popup", "prep"] as const).map((format) => {
            const Icon = chipIcons[format];
            return (
              <Button key={format} type="button" variant="outline" aria-pressed={filters.format === format}
                onClick={() => apply({ ...draft, format })}
                className="h-9 gap-1.5 rounded-full bg-transparent px-2.5 text-[11px] aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background sm:h-10 sm:px-3.5 sm:text-xs">
                <Icon className="size-3.5!" aria-hidden="true" /> {format ? formats[format] : "All spots"}
              </Button>
            );
          })}
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-input bg-card px-3 sm:inline-flex">
          <SlidersHorizontal size={15} className="text-muted-foreground" aria-hidden="true" />
          <label htmlFor="search-neighborhood" className="sr-only">Neighborhood</label>
          <select id="search-neighborhood" className="h-9 min-w-0 bg-transparent text-xs font-medium" value={filters.neighborhood} onChange={(event) => apply(readFilters({ ...draft, neighborhood: event.target.value }))}>
            <option value="">All Brooklyn</option>
            {Object.entries(neighborhoods).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="sm:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-9 rounded-full bg-card text-xs"><SlidersHorizontal aria-hidden="true" /> {filters.neighborhood ? neighborhoods[filters.neighborhood] : "Neighborhood"}</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl">
              <SheetHeader className="px-5 pt-5">
                <SheetTitle>Neighborhood</SheetTitle>
                <SheetDescription>Choose where you want to work in Brooklyn.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-2 px-5 pb-6">
                {Object.entries({ "": "All Brooklyn", ...neighborhoods }).map(([value, label]) => (
                  <Button key={value} variant="outline" className="h-11 justify-start bg-card aria-pressed:bg-accent" aria-pressed={draft.neighborhood === value}
                    onClick={() => apply(readFilters({ ...draft, neighborhood: value }))}>
                    <CookingPot aria-hidden="true" /> {label}
                  </Button>
                ))}
                {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
