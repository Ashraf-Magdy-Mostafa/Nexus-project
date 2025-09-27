
# ProDev Catalog (React + Vite + TS + Redux Toolkit + Tailwind)

A barebones, **working** front‑end for a dynamic e‑commerce product catalog. It demonstrates:
- API integration (mocked) with filtering, sorting, search
- Pagination **and** Infinite Scrolling (toggle in the controls)
- Redux Toolkit state management
- Tailwind CSS responsive UI

## Quick Start

```bash
npm install
npm run dev
```

Open the printed local URL (default: `http://localhost:5173`).

## Tech

- React 18 + TypeScript + Vite
- Redux Toolkit + React Redux
- Tailwind CSS 3

## Project Structure

```
src/
  lib/api.ts           # Mocked API (filters/sorts/paginates in-memory)
  mocks/products.json  # Seed product data (120 items)
  store/               # Redux slice
  components/          # UI components
  App.tsx              # Page layout
  main.tsx             # Entry point
  index.css            # Tailwind entry
```

## Notes

- Replace `src/lib/api.ts` with real HTTP requests when you have a backend. Keep the `Query` type.
- The UI supports both pagination and infinite scroll (via `IntersectionObserver`).
- Tailwind config scans `src/**/*.{ts,tsx}` and `index.html` for classes.

## Deploy

```bash
npm run build
npm run preview  # or deploy dist/ to Vercel/Netlify
```


## Cart
- Header shows a **Cart** button with a live item count.
- **Cart Drawer** (right side) with quantity controls, remove, clear, and subtotal.
- Cart persists in `localStorage`.


## Checkout
- `/checkout` route with **Shipping Details**, **Payment selection**, and **Order Summary**.
- Mock gateways in `src/payments/` (Stripe & PayPal). Replace with real SDK + server endpoints.
- On success, cart clears and you’re redirected to `/success`.
