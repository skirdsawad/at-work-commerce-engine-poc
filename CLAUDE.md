# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Commerce engine POC for an "at work" platform. Next.js 16 App Router application with TypeScript, shadcn/ui components, and Tailwind CSS 4. All source code lives under `frontend/`.

## Commands

All commands run from the `frontend/` directory:

```bash
cd frontend
npm run dev          # Dev server at http://localhost:5000
npm run build        # Production build
npm start            # Production server at port 5000
npm run lint         # ESLint
```

## Architecture

### Routing & Pages

- **Next.js App Router** — file-based routing under `frontend/src/app/`
- `/` — Products master data (CRUD)
- `/stores` — Stores master data (CRUD)
- `/manage-area` — Bulk product-to-store assignment

### API Layer

- Mock REST API via Next.js API routes (`src/app/api/`)
- Endpoints: `/api/products` and `/api/stores` with full CRUD
- Data persisted to JSON files in `src/data/` (products.json, stores.json) via Node.js `fs`

### Data Model

- **Product**: code (PK), name, description, storeCode (FK to Store)
- **Store**: code (PK), name, zone, phone, email, billing info, coordinates, O2O settings
- Relationship: Products assigned to Stores (many-to-one)

### UI Stack

- **shadcn/ui** (New York style) with Radix UI primitives
- **Tailwind CSS 4** with CSS variables for theming
- **Lucide React** icons
- Brand color: `#B89A5A` (tan/gold)
- Background: `#F8F7F4`
- Path alias: `@/*` → `./src/*`

## Code Conventions

### Enums Over Strings

Use enums for field names and modes instead of string literals. Types are defined in `src/types/`:
```typescript
enum ProductField { Code = "code", Name = "name", ... }
enum DialogMode { Create = "create", Edit = "edit" }
```

### Event Handlers

All event handlers must be named functions — never inline. Use `data-*` attributes for passing data:
```typescript
function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
  const code = e.currentTarget.getAttribute("data-code");
  // ...
}
```

### Control Flow

Always use braces `{ }` for `if` blocks, even single-line bodies.

### Component Patterns

- Pages are `"use client"` components with local state via `useState`/`useCallback`/`useEffect`
- CRUD pages use a dialog pattern: `dialogOpen` + `dialogMode` (Create/Edit) + `formData` state
- Empty state constants: `const EMPTY_PRODUCT = { ... }`
- API base URL constants: `const API_BASE = "/api/products"`
