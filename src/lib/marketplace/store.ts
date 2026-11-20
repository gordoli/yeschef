import { actors, appearances, batches, listings, memberships, organizations, products, venues } from "@mocks/fixtures";
import type { DemoRole, PlacementProposal, PlacementRequest, RequestStatus } from "@mocks/types";
import { invalidDateRange, type Filters } from "./search";

function fixture<T>(record: T | undefined): T {
  if (!record) throw new Error("A related marketplace fixture is missing.");
  return record;
}

function accountFor(role: DemoRole) {
  const membership = fixture(memberships.find((entry) => entry.role === role));
  const actor = fixture(actors.find(({ id }) => id === membership.actorId));
  const organization = fixture(organizations.find(({ id }) => id === membership.organizationId));
  return { actor, organization };
}

export const demoAccounts = { maker: accountFor("maker"), host: accountFor("host") };

const catalog = listings.map((listing) => ({
  listing,
  venue: fixture(venues.find(({ id }) => id === listing.venueId)),
}));

const guide = appearances.map((appearance) => {
  const batch = fixture(batches.find(({ id }) => id === appearance.batchId));
  const product = fixture(products.find(({ id }) => id === batch.productId));
  return {
    appearance,
    product,
    maker: fixture(organizations.find(({ id }) => id === product.makerOrganizationId)),
    venue: fixture(venues.find(({ id }) => id === appearance.venueId)),
  };
});

export type Opportunity = typeof catalog[number];
export type GuideEntry = typeof guide[number];

export function findOpportunities(filters: Filters) {
  if (invalidDateRange(filters)) return [];
  return catalog.flatMap((entry) => {
    const { listing, venue } = entry;
    if (
      (filters.venue && venue.type !== filters.venue) ||
      (filters.food && !listing.foodTypes.includes(filters.food)) ||
      (filters.neighborhood && venue.neighborhood !== filters.neighborhood) ||
      (filters.format && listing.format !== filters.format)
    ) return [];

    const matchingWindows = listing.windows.filter(({ date }) =>
      (!filters.from || date >= filters.from) && (!filters.through || date <= filters.through),
    );
    return matchingWindows.length ? [{ ...entry, matchingWindows }] : [];
  });
}

export function getOpportunity(slug: string) {
  return catalog.find(({ listing }) => listing.slug === slug);
}

export function getPublicGuide() {
  return guide;
}

export function getAppearance(slug: string) {
  return guide.find(({ appearance }) => appearance.slug === slug);
}

export function getHostOpportunities() {
  return catalog.filter(({ venue }) => venue.organizationId === demoAccounts.host.organization.id);
}

type Snapshot = { role: DemoRole; requests: PlacementRequest[] };
type ActionResult<T> = { ok: true; value: T } | { ok: false; error: string };

const empty: Snapshot = { role: "maker", requests: [] };
const storageKey = "yeschef.demo.v1";
const changeEvent = "yeschef:demo-change";
let lastRaw: string | null = null;
let snapshot = empty;

export const getServerSnapshot = () => empty;

export function getSnapshot(): Snapshot {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === lastRaw) return snapshot;
    const saved: Snapshot | null = raw ? JSON.parse(raw) : null;
    snapshot = saved && (saved.role === "maker" || saved.role === "host") && Array.isArray(saved.requests) ? saved : empty;
    lastRaw = raw;
    return snapshot;
  } catch {
    return empty;
  }
}

export function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) listener();
  };
  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", onStorage);
  };
}

function fail(error: string): ActionResult<never> {
  return { ok: false, error };
}

type Mutation<T> = (current: Snapshot) => ActionResult<{ next: Snapshot; value: T }>;

async function mutate<T>(update: Mutation<T>): Promise<ActionResult<T>> {
  function commit(): ActionResult<T> {
    const result = update(getSnapshot());
    if (!result.ok) return result;
    try {
      localStorage.setItem(storageKey, JSON.stringify(result.value.next));
    } catch {
      return fail("This browser couldn’t save the demo. Enable local storage and try again.");
    }
    window.dispatchEvent(new Event(changeEvent));
    return { ok: true, value: result.value.value };
  }
  return navigator.locks ? navigator.locks.request(storageKey, commit) : commit();
}

export function switchRole(role: DemoRole) {
  return mutate((current) => ({ ok: true, value: { next: { ...current, role }, value: role } }));
}

export function getRequestStatus(request: PlacementRequest): RequestStatus {
  if (!request.offer) return "requested";
  return request.acceptedRevision === request.offer.terms.revision ? "accepted" : "offered";
}

export function getRequests({ role, requests }: Snapshot) {
  const organizationId = demoAccounts[role].organization.id;
  return requests.filter((request) => role === "maker"
    ? request.makerOrganizationId === organizationId
    : getOpportunity(request.listingSlug)?.venue.organizationId === organizationId);
}

export function getRequestContext(request: PlacementRequest) {
  const opportunity = fixture(getOpportunity(request.listingSlug));
  const window = fixture(opportunity.listing.windows.find(({ id }) => id === request.windowId));
  const maker = fixture(organizations.find(({ id }) => id === request.makerOrganizationId));
  return { ...opportunity, window, maker };
}

export function createRequest(listingSlug: string, windowId: string, input: PlacementProposal) {
  return mutate((current) => {
    const opportunity = getOpportunity(listingSlug);
    const listing = opportunity?.listing;
    const window = listing?.windows.find(({ id }) => id === windowId);
    if (current.role !== "maker") return fail("Switch to Mina Park to request a spot.");
    if (listing?.format !== "placement" || !window) return fail("Choose an available counter window.");
    const { quantity } = input;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > window.capacity) {
      return fail(`Enter a quantity from 1 to ${window.capacity}.`);
    }
    const proposal = { ...input, productName: input.productName.trim(), source: input.source.trim() };
    if (!proposal.productName || !proposal.source || proposal.dropOff !== listing.receiving) {
      return fail("Enter a product, production source, and the listed drop-off time.");
    }
    const makerOrganizationId = demoAccounts.maker.organization.id;
    const existing = current.requests.find((request) =>
      request.listingSlug === listingSlug && request.windowId === windowId &&
      request.makerOrganizationId === makerOrganizationId,
    );
    if (existing) {
      const sameProposal = existing.proposal.productName === proposal.productName &&
        existing.proposal.quantity === proposal.quantity && existing.proposal.source === proposal.source;
      return sameProposal
        ? { ok: true, value: { next: current, value: existing.id } }
        : fail("You already have a demo request for this window. Open it from My requests.");
    }

    const id = crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)),
      (byte) => byte.toString(16).padStart(2, "0"),
    ).join("");
    const request: PlacementRequest = {
      id, listingSlug, windowId, makerOrganizationId, proposal,
      estimatedUnitCents: listing.rateCents, createdAt: new Date().toISOString(),
    };
    return { ok: true, value: { next: { ...current, requests: [request, ...current.requests] }, value: request.id } };
  });
}

function updateRequest(id: string, role: DemoRole, update: (request: PlacementRequest) => ActionResult<PlacementRequest>) {
  return mutate((current) => {
    if (current.role !== role) return fail(`Switch to the demo ${role} to continue.`);
    const request = getRequests(current).find((request) => request.id === id);
    if (!request) return fail("This request is unavailable for the active demo role.");
    const result = update(request);
    if (!result.ok) return result;
    const requests = current.requests.map((entry) => entry.id === id ? result.value : entry);
    return { ok: true, value: { next: { ...current, requests }, value: id } };
  });
}

export function sendOffer(id: string, unitCents: number) {
  return updateRequest(id, "host", (request) => {
    if (request.offer) return fail("An offer is already on this request.");
    if (!Number.isSafeInteger(unitCents) || unitCents < 1 || unitCents > 100000) {
      return fail("Enter a wholesale unit price between $0.01 and $1,000.");
    }
    const { maker, venue, window } = getRequestContext(request);
    const { productName, quantity, dropOff } = request.proposal;
    return { ok: true, value: {
      ...request,
      offer: {
        sentAt: new Date().toISOString(),
        terms: {
          revision: 1, productName, quantity, unitCents, totalCents: quantity * unitCents, date: window.date,
          dropOff, displayHours: window.hours, payer: venue.name, payee: maker.name,
          payment: `Due within 7 days of delivery for units accepted by ${venue.name}.`,
          handoff: `Deliver individually packaged and labeled units. ${venue.name} handles display, checkout, and any unsold accepted units.`,
        },
      },
    } };
  });
}

export function acceptOffer(id: string, revision: number) {
  return updateRequest(id, "maker", (request) => {
    if (!request.offer || request.offer.terms.revision !== revision) {
      return fail("This offer has changed. Review the latest terms before accepting.");
    }
    return { ok: true, value: { ...request, acceptedRevision: revision } };
  });
}
