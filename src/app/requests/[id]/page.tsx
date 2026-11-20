import type { Metadata } from "next";
import { RequestDetail } from "@/components/marketplace/request-views";

export const metadata: Metadata = { title: "My request" };

export default async function MakerRequestPage({ params }: PageProps<"/requests/[id]">) {
  return <RequestDetail id={(await params).id} role="maker" />;
}
