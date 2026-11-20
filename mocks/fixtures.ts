import type { Actor, Appearance, Batch, Listing, Membership, Organization, Product, Venue } from "./types";

export const actors = [
  { id: "mina", name: "Mina Park" },
  { id: "alex", name: "Alex Rivera" },
] satisfies Actor[];

export const organizations = [
  { id: "mina-bakes", name: "Mina Park", kind: "maker" },
  { id: "juniper", name: "Juniper Café", kind: "host" },
  { id: "ember", name: "Ember Room", kind: "host" },
  { id: "morning", name: "Morning Loaf", kind: "host" },
  { id: "crumb-seed", name: "Crumb & Seed", kind: "maker" },
] satisfies Organization[];

export const memberships = [
  { actorId: "mina", organizationId: "mina-bakes", role: "maker" },
  { actorId: "alex", organizationId: "juniper", role: "host" },
] satisfies Membership[];

export const venues = [
  { id: "juniper-cafe", organizationId: "juniper", name: "Juniper Café", type: "cafe", neighborhood: "fort-greene", timeZone: "America/New_York", address: "Fort Greene, Brooklyn, NY" },
  { id: "ember-room", organizationId: "ember", name: "Ember Room", type: "restaurant", neighborhood: "clinton-hill", timeZone: "America/New_York", address: "Clinton Hill, Brooklyn, NY" },
  { id: "morning-loaf", organizationId: "morning", name: "Morning Loaf", type: "bakery", neighborhood: "fort-greene", timeZone: "America/New_York", address: "Fort Greene, Brooklyn, NY" },
] satisfies Venue[];

export const listings: Listing[] = [
  {
    slug: "saturday-pastry-counter",
    venueId: "juniper-cafe",
    title: "Saturday pastry counter",
    description: "Put a small batch on the counter at a sunny Fort Greene café. The Juniper team handles display and checkout during its Saturday coffee service.",
    format: "placement",
    foodTypes: ["baked-goods"],
    photo: { src: "/photos/juniper-cafe.webp", alt: "Sunlit café with pastries in a glass counter", position: "center 54%" },
    receiving: "8:30 AM",
    windows: [
      { id: "juniper-dec-5", date: "2026-12-05", hours: "9 AM–1 PM", capacity: 10 },
      { id: "juniper-dec-12", date: "2026-12-12", hours: "9 AM–1 PM", capacity: 10 },
    ],
    rateCents: 300,
    resources: [{ name: "Counter display and shop checkout", feeCents: 0 }],
  },
  {
    slug: "sunday-dinner-pop-up",
    venueId: "ember-room",
    title: "Sunday dinner pop-up",
    description: "Bring your menu to an intimate Clinton Hill dining room. An oven and prep table are included, with optional front-of-house help from the Ember team.",
    format: "popup",
    foodTypes: ["savory-food", "bread-and-pizza"],
    photo: { src: "/photos/ember-room.webp", alt: "Restaurant kitchen with a stainless steel range and prep counter", position: "center 51%" },
    access: "4 PM",
    cleanup: "10 PM",
    crew: { name: "Front-of-house support", feeCents: 12000 },
    windows: [
      { id: "ember-dec-6", date: "2026-12-06", hours: "6–9 PM", capacity: 24 },
      { id: "ember-dec-13", date: "2026-12-13", hours: "6–9 PM", capacity: 24 },
    ],
    rateCents: 20000,
    resources: [{ name: "Oven", feeCents: 0 }, { name: "Prep table", feeCents: 0 }],
  },
  {
    slug: "bakery-prep-shift",
    venueId: "morning-loaf",
    title: "Bakery prep shift",
    description: "Take a four-hour morning shift in a working Fort Greene bakery. One bench, a deck oven, a mixer, and cooling racks are ready for your next batch.",
    format: "prep",
    foodTypes: ["baked-goods", "bread-and-pizza"],
    photo: { src: "/photos/morning-loaf.webp", alt: "Bakery prep kitchen with bread racks and a central workbench", position: "center 52%" },
    shiftHours: 4,
    windows: [
      { id: "morning-dec-4", date: "2026-12-04", hours: "8 AM–noon", capacity: 1 },
      { id: "morning-dec-11", date: "2026-12-11", hours: "8 AM–noon", capacity: 1 },
    ],
    rateCents: 14000,
    resources: [{ name: "Deck oven", feeCents: 0 }, { name: "Mixer", feeCents: 0 }, { name: "Cooling racks", feeCents: 0 }],
  },
];

export const products = [
  { id: "sesame-shortbread", makerOrganizationId: "crumb-seed", name: "Sesame shortbread", allergens: "Contains wheat, milk, and sesame." },
] satisfies Product[];

export const batches = [
  { id: "crumb-seed-dec-19", productId: "sesame-shortbread", quantity: 10 },
] satisfies Batch[];

export const appearances: Appearance[] = [
  {
    slug: "crumb-and-seed-at-juniper-cafe",
    venueId: "juniper-cafe",
    batchId: "crumb-seed-dec-19",
    date: "2026-12-19",
    hours: "9 AM–1 PM",
    priceCents: 600,
    photo: { src: "/photos/sesame-shortbread.webp", alt: "Sesame shortbread cookies on a ceramic plate", position: "center 55%" },
    description: "Crumb & Seed brings buttery, sesame-crusted shortbread to Juniper Café for one Saturday morning. Ask for a cookie at the counter while supplies last.",
    status: "confirmed",
  },
];
