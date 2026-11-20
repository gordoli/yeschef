export type DemoRole = "maker" | "host";
export type Actor = { id: string; name: string };
export type Organization = { id: string; name: string; kind: DemoRole };
export type Membership = { actorId: string; organizationId: string; role: DemoRole };

export type VenueType = "cafe" | "restaurant" | "bakery";
export type Neighborhood = "fort-greene" | "clinton-hill";
export type FoodType = "baked-goods" | "bread-and-pizza" | "savory-food";
export type Format = "placement" | "popup" | "prep";

export type Venue = {
  id: string;
  organizationId: string;
  name: string;
  type: VenueType;
  neighborhood: Neighborhood;
  timeZone: "America/New_York";
  address: string;
};

export type Photo = { src: string; alt: string; position?: string };
export type Resource = { name: string; feeCents: number };
export type Availability = { id: string; date: string; hours: string; capacity: number };

type ListingBase = {
  slug: string;
  venueId: string;
  title: string;
  description: string;
  foodTypes: FoodType[];
  photo: Photo;
  windows: Availability[];
  rateCents: number;
  resources: Resource[];
};

export type Placement = ListingBase & { format: "placement"; receiving: string };
export type PopUp = ListingBase & { format: "popup"; access: string; cleanup: string; crew: Resource };
export type Prep = ListingBase & { format: "prep"; shiftHours: number };
export type Listing = Placement | PopUp | Prep;

export type Product = { id: string; makerOrganizationId: string; name: string; allergens: string };
export type Batch = { id: string; productId: string; quantity: number };
export type PlacementProposal = { productName: string; quantity: number; source: string; dropOff: string };

export type PlacementRequest = {
  id: string;
  listingSlug: string;
  windowId: string;
  makerOrganizationId: string;
  proposal: PlacementProposal;
  estimatedUnitCents: number;
  createdAt: string;
  offer?: Offer;
  acceptedRevision?: number;
};

export type TermsRevision = {
  revision: number;
  productName: string;
  quantity: number;
  unitCents: number;
  totalCents: number;
  date: string;
  dropOff: string;
  displayHours: string;
  payer: string;
  payee: string;
  payment: string;
  handoff: string;
};

export type Offer = { sentAt: string; terms: TermsRevision };
export type RequestStatus = "requested" | "offered" | "accepted";
export type Eligibility = { organizationId: string; status: "pending" | "approved" };
export type PaymentStatus = "not-due" | "due" | "paid";
export type Agreement = { id: string; requestId: string; terms: TermsRevision; paymentStatus: PaymentStatus };
export type Incident = { id: string; agreementId: string; status: "open" | "resolved" };

export type Appearance = {
  slug: string;
  venueId: string;
  batchId: string;
  date: string;
  hours: string;
  priceCents: number;
  photo: Photo;
  description: string;
  status: "confirmed" | "sold-out";
};
