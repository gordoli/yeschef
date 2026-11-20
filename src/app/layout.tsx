import type { Metadata } from "next";
import { ChefHat, MapPin } from "lucide-react";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "./globals.css";
import { Header } from "@/components/marketplace/header";

export const metadata: Metadata = {
  title: { default: "Find a spot | YesChef", template: "%s | YesChef" },
  description: "Find a counter, kitchen, or dining room for your next food project in Brooklyn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main id="main" tabIndex={-1} className="site-width flex-1 outline-none">
          {children}
        </main>
        <footer className="mt-12 border-t border-border sm:mt-16">
          <div className="site-width flex min-h-17 flex-wrap items-center justify-between gap-3 py-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-base font-semibold tracking-[-0.055em] text-primary-hover">
              <ChefHat size={17} aria-hidden="true" /> YesChef
            </span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} aria-hidden="true" /> Brooklyn, NY · Demo marketplace</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
