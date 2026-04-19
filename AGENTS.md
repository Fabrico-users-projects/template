# Cloudflare Workers

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

## Node.js Compatibility

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

## Errors

- **Error 1102** (CPU/Memory exceeded): Retrieve limits from `/workers/platform/limits/`
- **All errors**: https://developers.cloudflare.com/workers/observability/errors/

## Product Docs

Retrieve API references and limits from:
`/kv/` · `/r2/` · `/d1/` · `/durable-objects/` · `/queues/` · `/vectorize/` · `/workers-ai/` · `/agents/`

## This Project

**Stack**: Hono + `@hono/zod-openapi` · Neon PostgreSQL (`@neondatabase/serverless` + Drizzle ORM) · React 19 + Vite + Tailwind CSS v4

**OpenAPI docs**: `/doc` (JSON) · `/ui` (Swagger UI)

### Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/hello-Fabrico` | Returns `{ "message": "Hello, Fabrico!" }` |

### Adding a route

1. Create `src/worker/routes/<name>.ts` using `OpenAPIHono`
2. Register in `src/worker/routes/index.ts` via `routes.route('/path', handler)`
3. Run `pnpm cf-typegen` after changing `wrangler.json`

### Database

`createDb(c.env.DATABASE_URL)` in `src/worker/lib/db.ts` returns a Drizzle instance connected to Neon via HTTP fetch (edge-compatible).
