import type { Format, Listing } from "@mocks/types";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const dateLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York" });

export const money = (cents: number) => currency.format(cents / 100).replace(/\.00$/, "");
export const displayDate = (date: string) => dateLabel.format(new Date(`${date}T12:00:00Z`));

export const formatLabel: Record<Format, string> = {
  placement: "Counter slot",
  popup: "Pop-up",
  prep: "Prep kitchen",
};

export const rateUnit: Record<Format, string> = {
  placement: "/ accepted unit",
  popup: "/ service",
  prep: "/ 4-hour shift",
};

export function capacityLabel(format: Listing["format"], capacity: number) {
  if (format === "placement") return `${capacity} packaged units`;
  if (format === "popup") return `${capacity} guests`;
  return `${capacity} workstation${capacity === 1 ? "" : "s"}`;
}
