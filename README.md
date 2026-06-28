# RentEase — Furniture & Appliance Rental Platform

A full-stack monthly rental platform for furniture and appliances, built for
students and working professionals who relocate often.

```
rentease/
├── backend/   Node.js + Express + MongoDB REST API
├── frontend/  React (Vite) + Tailwind CSS storefront, vendor & admin dashboards
└── docs/      Product Requirements Document (RentEase_PRD.md)
```

## Tech stack

- **Frontend:** React 19 (JavaScript), Vite, Tailwind CSS, React Router,
  Context API + useReducer (auth, cart & location state), Axios, Swiper (pinned to v11 — v12
  has a known layout bug with aspect-ratio containers on narrow viewports),
  lucide-react (UI chrome
  icons), react-hot-toast. The brand mark and every category icon are
  original, hand-drawn SVGs — not sourced from any icon library. Product
  photography is real photography from Unsplash (Unsplash License, free for
  commercial use), hotlinked directly.
- **Backend:** Node.js, Express.js, REST API, JWT auth (HTTP-only cookies),
  bcryptjs, express-validator, helmet, express-rate-limit.
- **Database:** MongoDB (Atlas-ready — `backend/.env` ships pre-configured
  with a MongoDB Atlas connection string).

## Prerequisites

- Node.js 18+ and npm
- A MongoDB connection string — `backend/.env` already points at a MongoDB
  Atlas cluster, so no local database install is required. If you'd rather
  use your own, swap `MONGO_URI` for a local `mongod` or your own Atlas
  cluster.

## 1. Backend setup

```bash
cd backend
npm install
npm run seed              # creates demo users + a 28-item catalog across price tiers
npm run dev                # starts the API on http://localhost:5000
```

Demo accounts created by the seed script:

| Role        | Email                  | Password        |
|-------------|-------------------------|-----------------|
| Admin       | admin@rentease.com      | Admin@12345     |
| Vendor 1    | vendor@rentease.com     | Vendor@12345    |
| Vendor 2    | vendor2@rentease.com    | Vendor@12345    |
| Customer    | customer@rentease.com   | Customer@12345  |

Two vendor accounts are seeded — **UrbanNest Rentals** (budget-to-mid tier,
covers Bengaluru/Hyderabad/Pune/Mumbai) and **Maison Premium Living**
(premium tier, covers Bengaluru/Mumbai/Delhi) — so the marketplace has more
than one seller from the start.

> **Note on transactions:** checkout uses a MongoDB transaction when the
> database is a replica set (Atlas clusters are). If you point `MONGO_URI`
> at a standalone local `mongod` instead, the API automatically detects
> that transactions aren't supported and falls back to sequential writes,
> so checkout still works either way.

## 2. Frontend setup

```bash
cd frontend
.env       # set VITE_API_URL if your API isn't on localhost:5000
npm install
npm run dev                 # starts the app on http://localhost:5173
```

## 3. Using the app

1. Visit the homepage and either allow location detection or pick a city
   manually from the header (top right on desktop, in the mobile menu on
   small screens).
2. Browse the catalog, open a product, choose a tenure (3 / 6 / 12 months —
   longer tenures cost less per month), and add it to your cart.
3. Log in as the demo customer (or register a new account) to check out.
4. Log in as the demo vendor to manage listings and fulfil orders from
   `/vendor`.
5. Log in as the demo admin to approve vendors, manage service areas, and
   view platform KPIs from `/admin`.

## Production build

```bash
cd frontend
npm run build      # outputs static files to frontend/dist
```

Serve `frontend/dist` from any static host (Vercel, Netlify, S3 + CDN, etc.)
and point `VITE_API_URL` at your deployed backend. Deploy `backend/` to any
Node-compatible host (Render, Railway, a VM, etc.) with a production
`MONGO_URI` and a strong `JWT_SECRET`.

> **Before deploying to production:** rotate the MongoDB Atlas credentials
> and `JWT_SECRET` shipped in `backend/.env` — they're fine for local
> development and demos, but a real deployment should use its own secrets,
> kept out of version control.

## Documentation

See `docs/RentEase_PRD.md` for the full Product Requirements Document,
covering scope, functional and non-functional requirements, system
architecture, data model, visual design system, and API surface.
