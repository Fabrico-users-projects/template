# Cloudflare Workers & Fabrico Infrastructure

STOP. Your knowledge of Cloudflare Workers APIs and limits may be outdated. Always retrieve current documentation before any Workers, KV, R2, D1, Durable Objects, Queues, Vectorize, AI, or Agents SDK task.

## Docs

- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

For all limits and quotas, retrieve from the product's `/platform/limits/` page. eg. `/workers/platform/limits`

## Commands

| Command | Purpose |
|---------|---------|
| `npx wrangler dev` | Local development |
| `npx wrangler deploy` | Deploy to Cloudflare |
| `npx wrangler types` | Generate TypeScript types |

Run `wrangler types` after changing bindings in wrangler.jsonc.

## This Project & Fabrico Cloud

**Stack**: Hono + `@hono/zod-openapi` · React 19 + Vite + Tailwind CSS v4

**CRITICAL RULE: USE FABRICO SDK for BaaS.**
You must NOT install or use direct connections to `better-auth`, raw Neon PostgreSQL, or external AI providers. All of these are provided securely via the `@fabrico/sdk` which proxies requests to the isolated Fabrico Cloud infrastructure.

### Database (Drizzle ORM via Fabrico)
You can still use Drizzle ORM! It is configured to proxy over Fabrico.
1. Define schema in `src/worker/lib/schema.ts`.
2. Get the database instance:
```typescript
import { createDb } from "./lib/db";
const db = createDb(c.env);
await db.select().from(schema.users);
```

### Authentication (On-Demand)
**DO NOT** add authentication to the frontend React app unless the user explicitly requests it.
If requested, setup auth:
1. Wrap `src/react-app/main.tsx` in `<FabricoProvider client={fabrico}>`.
2. Use `<SignedIn>`, `<SignedOut>`, and `useUser()` from `fabrico-sdk/react`.
3. In Hono routes, use `await fabrico.auth.verifySession(req)` to protect endpoints.

### Adding a route

1. Create `src/worker/routes/<name>.ts` using `OpenAPIHono`
2. Register in `src/worker/routes/index.ts` via `routes.route('/path', handler)`
3. Run `pnpm cf-typegen` after changing `wrangler.json`
