import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="pt-10">
      <h1 className="page-title">Page unavailable<span className="text-primary">.</span></h1>
      <p className="mt-2 text-sm text-muted-foreground">Browse current demo opportunities in Brooklyn.</p>
      <Button asChild className="mt-4 h-11"><Link href="/">Find a spot</Link></Button>
    </div>
  );
}
