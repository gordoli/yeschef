import type { Metadata } from "next";
import { RequestList, RoleGate } from "@/components/marketplace/request-views";

export const metadata: Metadata = { title: "My requests" };

export default function RequestsPage() {
  return (
    <section className="pt-8 sm:pt-11">
      <h1 className="page-title">My requests<span className="text-primary">.</span></h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground sm:text-base">Track Mina Park’s demo requests and wholesale offers.</p>
      <RoleGate role="maker"><RequestList role="maker" /></RoleGate>
    </section>
  );
}
