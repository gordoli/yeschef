import type { FoodType, Format, Neighborhood, VenueType } from "@mocks/types";

export const venueTypes = {
  cafe: "Café",
  restaurant: "Restaurant",
  bakery: "Bakery",
} satisfies Record<VenueType, string>;

export const foodTypes = {
  "baked-goods": "Baked goods",
  "bread-and-pizza": "Bread & pizza",
  "savory-food": "Savory food",
} satisfies Record<FoodType, string>;

export const neighborhoods = {
  "fort-greene": "Fort Greene",
  "clinton-hill": "Clinton Hill",
} satisfies Record<Neighborhood, string>;

export const formats = {
  placement: "Counter slots",
  popup: "Pop-ups",
  prep: "Prep kitchens",
} satisfies Record<Format, string>;

export type Filters = {
  venue: VenueType | "";
  food: FoodType | "";
  from: string;
  through: string;
  neighborhood: Neighborhood | "";
  format: Format | "";
};

type Query = Record<string, string | string[] | undefined>;

function option<Key extends string>(values: Record<Key, string>, value: Query[string]): Key | "" {
  return typeof value === "string" && Object.hasOwn(values, value) ? value as Key : "";
}

function isoDate(value: Query[string]) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value ? "" : value;
}

export function readFilters(query: Query): Filters {
  return {
    venue: option(venueTypes, query.venue),
    food: option(foodTypes, query.food),
    from: isoDate(query.from),
    through: isoDate(query.through),
    neighborhood: option(neighborhoods, query.neighborhood),
    format: option(formats, query.format),
  };
}

export function invalidDateRange(filters: Filters) {
  return Boolean(filters.from && filters.through && filters.through < filters.from);
}

export function filterQuery(filters: Filters) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
  return query.size ? `?${query}` : "";
}
