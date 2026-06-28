# RentEase — Furniture & Appliance Rental Platform

**Product Requirements Document**
Version 1.1 · June 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope of Work](#2-scope-of-work)
3. [User Roles](#3-user-roles)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Architecture](#6-system-architecture)
7. [Data Model](#7-data-model)
8. [API Surface (Summary)](#8-api-surface-summary)
9. [Visual Design System](#9-visual-design-system)
10. [Key Performance Indicators](#10-key-performance-indicators)
11. [Assumptions & Constraints](#11-assumptions--constraints)
12. [Future Enhancements](#12-future-enhancements)
13. [Glossary](#13-glossary)

---

## 1. Executive Summary

RentEase is a web-based platform that lets students and working professionals rent furniture and appliances on flexible monthly plans instead of purchasing them outright. The platform targets the specific pain points of frequent relocation: high upfront costs, transport difficulty, inflexible terms, fragmented local supply, and poor after-sale support.

The catalog and pricing are deliberately spread across budget, mid, and premium tiers so the platform serves **every kind of renter** — bachelors and students furnishing a first room, couples setting up a home together, families needing full-size furniture and appliances, and customers who want premium, hotel-grade pieces without buying them outright.

This document defines the product scope, functional and non-functional requirements, system architecture, data model, and API contract for the RentEase platform, and reflects the implementation delivered alongside it: a React (Vite) frontend, a Node.js/Express REST API, and a MongoDB Atlas database.

### 1.1 Problem Statement

Relocating students and professionals frequently need furniture and appliances for a limited, often-unpredictable duration. Buying these items new is expensive and impractical when the next move could be months away; reselling used items is time-consuming and yields poor returns. Existing rental options in most cities are informal, inconsistent, or limited to single product categories, and rarely include maintenance support.

- High upfront cost of furnishing a new home
- Difficulty transporting bulky items between cities
- Lack of flexible, month-to-month rental plans
- Limited, fragmented local rental supply
- Poor maintenance and after-sale support from informal rental sources

### 1.2 Objectives

**Primary objectives**
- Provide affordable monthly rental options for furniture and appliances
- Offer flexible tenure plans (3, 6, and 12 months, extendable)
- Simplify discovery and access to rental inventory for renters
- Improve urban living convenience for people who move often
- Serve every audience segment — bachelors, couples, families, budget-conscious and premium customers — with appropriately tiered inventory

**Secondary objectives**
- Reduce unnecessary one-time purchases of depreciating goods
- Promote sustainable consumption through shared/reused inventory
- Enable a smoother relocation experience end-to-end
- Create a scalable, multi-vendor rental ecosystem

---

## 2. Scope of Work

### 2.1 In Scope

- A responsive, web-based rental platform (desktop and mobile browsers)
- A searchable product catalog for furniture and appliances, spanning budget to premium tiers
- Monthly rental plans with multiple tenure options per product
- Delivery and pickup scheduling with date and time-slot selection
- Maintenance request workflow for active rentals
- Vendor-managed inventory, pricing, and order fulfillment, supporting multiple vendors
- Admin oversight of users, orders, disputes, and service areas
- Location detection (browser geolocation, with manual city fallback) to filter inventory by city

### 2.2 Out of Scope (current release)

- Native mobile applications (iOS / Android)
- Cross-border / international rentals
- AI-based dynamic pricing
- Second-hand resale marketplace
- Live online payment gateway integration (orders are confirmed and billed offline in this release; see [Section 12](#12-future-enhancements))

---

## 3. User Roles

RentEase supports three distinct roles, each with a dedicated interface.

### 3.1 Customer (Renter)

- Register and log in; manage profile and saved addresses
- Detect or select a city to see deliverable inventory
- Browse furniture and appliances by category and sub-category, across price tiers
- View product detail, choose a tenure plan, and add to cart
- Checkout: enter delivery address, schedule date/slot, choose payment method
- View rental history and manage active rentals
- Request a tenure extension or schedule a return pickup
- Raise and track maintenance requests for active rentals

### 3.2 Vendor (Inventory Owner)

- Register as a vendor (subject to admin approval before listings go live)
- Add, edit, publish/unpublish, and delete product listings
- Define tenure options, pricing, and security deposit per product
- Define service areas (cities) where their inventory can be delivered
- Track and update order status from confirmation through return
- Report item damage and an associated charge after a return
- Receive and resolve maintenance requests for their products

### 3.3 Administrator

- Approve or suspend vendor accounts; activate/deactivate any user
- Monitor all orders across vendors and intervene in disputes
- Manage the list of serviceable cities and pincodes
- View platform-wide analytics and KPIs (see [Section 10](#10-key-performance-indicators))
- Oversee maintenance requests across all vendors

---

## 4. Functional Requirements

### 4.1 Catalog & Discovery

1. Products are categorized as **Furniture** (bed, sofa, study table, wardrobe, dining table, armchair/recliner, bookshelf, bunk bed) or **Appliances** (fridge, washing machine, TV, AC, microwave).
2. Each product defines one or more tenure options (e.g. 3 / 6 / 12 months), each with its own monthly rent and optional discount percentage — longer tenures are priced lower per month.
3. The catalog spans multiple price tiers per category — for example, a budget single bed for students sits alongside a premium walnut-finish king bed, and a compact studio sofa sits alongside a family-size sectional.
4. Listings can be filtered by category, sub-category, price range, and city, and sorted by newest, price, or rating.
5. A full-text search covers product title, description, sub-category, and brand.
6. The platform can detect the customer's current city via browser geolocation (with manual fallback) and uses it to filter inventory to what is actually deliverable.

### 4.2 Cart & Checkout

1. Customers select a tenure plan and quantity per product; quantity is capped by live available-unit stock.
2. The cart is persisted locally so it survives a page refresh.
3. Checkout collects a delivery address (reusable from saved addresses), a delivery date and time slot, and a payment method preference.
4. On order placement, available stock is decremented per item; the system uses a database transaction where supported, with a safe fallback for standalone (non-replica-set) database deployments.
5. Order totals separate the recurring monthly rent from the one-time, refundable security deposit.

### 4.3 Rental Lifecycle

1. Orders move through a defined status flow: **Pending confirmation → Confirmed → Out for delivery → Active → Return scheduled → Returned** (or **Cancelled** at an earlier stage).
2. Vendors and admins advance order status; the system stamps a timestamped status history entry at every transition.
3. Marking an order **Active** records a rental start date and computes an end date from the longest tenure among its items.
4. Customers can request a tenure extension on an active rental, which pushes out the computed end date.
5. Customers can schedule a return pickup (date and time slot) on a confirmed, out-for-delivery, or active order.
6. Returning or cancelling an order releases the reserved inventory back to available stock, exactly once per order.
7. Vendors/admins can report item damage on a returned order, recording notes and an associated charge.

### 4.4 Maintenance Support

1. Customers can raise a maintenance request against any item in an active order, selecting an issue type (not working, damaged, noisy, needs cleaning, replacement requested, other) with a free-text description and optional preferred visit date.
2. Requests are routed to the vendor who owns the product and tracked through: **Open → Acknowledged → Technician assigned → Resolved → Closed**.
3. Vendors can add resolution notes visible to the customer once a request is resolved.
4. Admins can view maintenance requests across all vendors for oversight.

### 4.5 Vendor Operations

1. Vendor accounts require admin approval (`vendorApproved` flag) before being treated as fully active.
2. Vendors manage their own product catalog, including images, specifications, condition, tenure pricing, deposit, stock levels, and service-area coverage.
3. Vendors view and act only on orders and maintenance requests that involve their own products.
4. The platform supports multiple vendors operating simultaneously (e.g. a value-focused vendor and a premium-focused vendor), each with independent service areas and catalogs.

### 4.6 Administration

1. Admins can list, filter, activate/deactivate any user, and approve/revoke vendor status.
2. Admins manage the list of serviceable cities, their states, and covered pincodes, and can pause/resume service to a city.
3. Admins can view and filter all orders and maintenance requests platform-wide.
4. A dashboard surfaces key operational metrics in real time (see [Section 10](#10-key-performance-indicators)).

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Target page load under 3 seconds on a typical broadband/4G connection; catalog queries are paginated and indexed. |
| Security | Passwords are hashed (bcrypt, 11 rounds); sessions use HTTP-only, SameSite cookies with a signed JWT; role-based access control is enforced on every protected route; rate limiting is applied at the API gateway layer. |
| Reliability | Inventory counts are adjusted transactionally where the database deployment supports it, with a safe sequential fallback otherwise, to avoid overselling. |
| Usability | Mobile-first, responsive layout; consistent component library; clear status labelling throughout the rental lifecycle. |
| Scalability | Stateless API design behind a conventional Express server; city-based service areas allow incremental multi-city rollout without code changes. |
| Accessibility | Visible focus states, sufficient color contrast, and semantic form labelling throughout the interface. |

---

## 6. System Architecture

### 6.1 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (JavaScript) on Vite, React Router, Tailwind CSS, Context API + useReducer (cart & location state), Axios, Swiper, lucide-react (UI chrome icons), react-hot-toast |
| Backend | Node.js, Express.js, REST API, JWT authentication, bcryptjs, express-validator, helmet, express-rate-limit |
| Database | MongoDB Atlas (cloud-hosted) with Mongoose ODM |
| Imagery | Real product photography sourced from Unsplash (Unsplash License, free for commercial use), hotlinked directly from `images.unsplash.com` |
| Deployment target | Any Node-compatible host for the API (e.g. Render, Railway, a VM) and a static host or Vercel/Netlify for the built frontend |

### 6.2 High-Level Architecture

The system follows a conventional three-tier architecture: a single-page React application communicates with a stateless Express REST API over HTTPS, authenticated via an HTTP-only cookie containing a signed JWT. The API is the sole writer to MongoDB; the frontend never accesses the database directly.

- **Client (Browser)** — React SPA, client-side routing, Context API + useReducer for cart and location state, calls the API via Axios with credentials included.
- **API (Node/Express)** — route → middleware (auth, validation) → controller → Mongoose model; centralized error handling; rate limiting and security headers (helmet) at the edge.
- **Database (MongoDB Atlas)** — five core collections: User, Product, RentalOrder, MaintenanceRequest, ServiceArea.

### 6.3 Repository Layout

```
rentease/
├── backend/
│   └── src/
│       ├── models/       Mongoose schemas
│       ├── controllers/  Request handlers, grouped by domain
│       ├── routes/       Express routers + role-based middleware
│       ├── middleware/   Auth (JWT), validators, error handler
│       └── seed/         Demo data seed script
├── frontend/
│   └── src/
│       ├── pages/        Route-level views (customer, vendor, admin, auth)
│       ├── components/    Reusable components, grouped by domain
│       ├── context/      AuthContext, CartContext, LocationContext (useReducer)
│       └── icons/         Custom-built SVG icon set + brand mark
└── docs/
    └── RentEase_PRD.md   This document
```

---

## 7. Data Model

### 7.1 User

Stores name, email, hashed password, phone, role (`customer` / `vendor` / `admin`), saved addresses, and role-specific fields: vendors additionally carry `businessName`, `serviceAreas`, and a `vendorApproved` flag.

### 7.2 Product

Stores title, slug, description, category, sub-category, brand, images, `securityDeposit`, an array of tenure options (`months` / `monthlyRent` / `discountPercent`), specs, condition, the owning vendor, `serviceAreas`, and stock counts (`totalUnits` / `availableUnits`).

### 7.3 RentalOrder

Stores a generated order number, the customer, a snapshot of ordered items (price and tenure are captured at order time so later catalog changes do not retroactively alter an existing order), delivery address and schedule, rental start/end dates, pickup details, extension count, computed totals, status, payment status/method, damage fields, and a timestamped status history.

### 7.4 MaintenanceRequest

Stores the related order, product, customer, and vendor, an issue type, description, optional preferred date and photos, status, priority, and resolution notes.

### 7.5 ServiceArea

Stores a city, its state, an array of served pincodes, and an active flag used by admins to pause or resume coverage.

---

## 8. API Surface (Summary)

All endpoints are served under `/api` and return JSON. Protected endpoints require a valid session cookie (or bearer token) and, where noted, a specific role.

| Endpoint | Method | Access | Purpose |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Create a customer or vendor account |
| `/api/auth/login` | POST | Public | Authenticate and receive a session cookie |
| `/api/auth/me` | GET | Authenticated | Fetch the current session's profile |
| `/api/products` | GET | Public | Search/filter/paginate the catalog |
| `/api/products/:slug` | GET | Public | Fetch a single product |
| `/api/products` | POST | Vendor/Admin | Create a product listing |
| `/api/products/vendor/mine` | GET | Vendor/Admin | List the vendor's own listings |
| `/api/orders` | POST | Customer | Place a rental order (checkout) |
| `/api/orders/mine` | GET | Customer | List the customer's own orders |
| `/api/orders/:id/status` | PATCH | Vendor/Admin | Advance an order's lifecycle status |
| `/api/orders/:id/pickup` | POST | Customer | Schedule a return pickup |
| `/api/orders/:id/extend` | POST | Customer | Extend the rental tenure |
| `/api/maintenance` | POST | Customer | Raise a maintenance request |
| `/api/maintenance/vendor/mine` | GET | Vendor/Admin | List requests for the vendor's products |
| `/api/admin/dashboard-stats` | GET | Admin | Platform-wide KPIs and analytics |
| `/api/admin/service-areas` | GET / POST | Admin | Manage serviceable cities |

---

## 9. Visual Design System

The interface uses a deliberately distinctive system rather than generic UI-kit defaults:

- **Brand mark** — a custom, hand-drawn icon combining a house silhouette with a clock face, representing the core idea of the product: a home you live in for a measured stretch of time, not one you own forever. Used as the favicon and in the header logo.
- **Category icons** — a full custom SVG icon set (bed, sofa, table, wardrobe, dining table, armchair, bookshelf, bunk bed, fridge, washing machine, TV, AC, microwave) drawn in a consistent line-icon style, distinct from any third-party icon library.
- **Color palette** — a deep pine-charcoal (`#15201B`) and warm paper (`#FAF7F0`) base, a sage-green secondary brand color used for trust-oriented surfaces (buttons, active states), and a vivid coral-orange accent (`#FF7A33`) used for primary calls-to-action and highlights — chosen to read as energetic and broadly appealing across age groups and budgets, rather than a single muted tone.
- **Typography** — Space Grotesk for display headings, Inter for body text, and JetBrains Mono for prices and tenure figures, so rental pricing reads with the precision of a spec sheet.
- **Signature interaction** — a tenure-timeline selector on the product page and homepage hero, visualizing how monthly rent decreases as tenure length increases, making the platform's core value proposition visible rather than just stated.
- **Product photography** — real photographs sourced from Unsplash (not illustrations or stock-icon placeholders), giving every catalog item, and the homepage's audience-focused section, an authentic, tangible feel.

---

## 10. Key Performance Indicators

The admin dashboard surfaces the following metrics, computed directly from live order and product data:

- Number of active rentals
- Monthly recurring revenue (MRR), summed across active and returned orders
- Product utilization rate (rented units versus total listed units)
- Customer and vendor counts, and total listed products
- Pending maintenance request volume
- Security deposits currently held
- Order status breakdown and a monthly order/revenue trend

---

## 11. Assumptions & Constraints

### 11.1 Assumptions

- Target users prefer flexible rental over ownership for transient living situations, across income levels and household types
- Vendors can reliably fulfill delivery and pickup within their declared service areas
- Rental inventory is stored and dispatched locally within each serviceable city

### 11.2 Constraints

- Logistics and maintenance costs are borne by vendors and factored into pricing
- Physical wear and tear on rented items affects resale/re-rental value over time
- Inventory availability is inherently local and limited per city at launch

---

## 12. Future Enhancements

- Native mobile applications (iOS / Android)
- Live online payment gateway integration with auto-renewal billing
- Subscription bundles spanning multiple product categories
- Smart appliance usage/condition tracking via IoT or vendor-reported telemetry
- Furniture customization options at the point of listing
- Expansion of city coverage beyond the initial launch markets

---

## 13. Glossary

| Term | Definition |
|---|---|
| Tenure | The committed rental duration for an item (e.g. 3, 6, or 12 months), each priced independently. |
| Security deposit | A refundable, one-time charge held against loss or damage, returned after inspection on pickup. |
| Service area | A city (and its served pincodes) where RentEase has active delivery and vendor coverage. |
| MRR | Monthly recurring revenue — the sum of monthly rent across all active and returned rental orders. |
| Status history | A timestamped, append-only log of every status change on a rental order. |
