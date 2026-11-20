import type { Metadata } from "next";
import { RequestDetail } from "@/components/marketplace/request-views";

export const metadata: Metadata = { title: "Host request" };

export default async function HostRequestPage({ params }: PageProps<"/host/requests/[id]">) {
  return <RequestDetail id={(await params).id} role="host" />;
}
