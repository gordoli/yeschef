# YesChef

YesChef is a local demo of a Brooklyn marketplace for makers, neighborhood food venues, and diners. It uses Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and locally bundled Poppins.

## Run locally

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The demo uses fictional data and runs without services or setup credentials.

## Walk through the demo

1. In **Find a spot**, select **Café** and **Baked goods**. Set both dates to December 5, 2026, then choose **Find spots**.
2. Open **Saturday pastry counter**. Use the prefilled proposal to submit a ten-unit demo request for cardamom shortbread.
3. From the role menu, select **Host · Juniper Café**. Open the incoming request and send the offer at $3 per accepted unit.
4. Switch to **Maker · Mina Park**. Open the request in **My requests** and accept the $30 offer.
5. Reopen the request in each role. Both views show revision 1 and **Accepted · review pending**. **Explore food** includes a separate seeded appearance from Crumb & Seed.

Demo changes live in this browser’s local storage. Clear this site’s storage to reset the walkthrough. Fixture dates use venue-local time in Brooklyn and stay fixed for repeatable testing.

## Project layout

- `mocks/types.ts` and `mocks/fixtures.ts` hold the marketplace contracts and seeded records.
- `src/lib/marketplace/store.ts` owns fixture reads, browser persistence, and request transitions.
- `src/theme/marketplace.css` holds the semantic theme tokens.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
```
