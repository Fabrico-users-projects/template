# Vite + React + Hono + Cloudflare Workers Template

A modern, full-stack boilerplate for building high-performance applications on the Cloudflare edge. Powered by the [Fabrico SDK](https://fabrico.diy) for seamless authentication, database access, and AI integration.

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [React Router 7](https://reactrouter.com/), [Radix UI](https://www.radix-ui.com/).
- **Backend**: [Hono](https://hono.dev/) with [Zod OpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) for type-safe APIs.
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) with [Cloudflare Assets](https://developers.cloudflare.com/workers/static-assets/).
- **SDK**: [@fabrico/sdk](https://www.npmjs.com/package/@fabrico/sdk) for Auth, DB, AI models, and Realtime sync.

## 📂 Project Structure & Architecture

A modular layout designed for edge-native performance. For AI agents: The project is a single Cloudflare Worker that serves a React SPA (Assets) while proxying API requests to a Hono router.

```text
.
├── src/
│   ├── react-app/              # Frontend SPA (Vite + React 19)
│   │   ├── assets/             # Static SVGs and images
│   │   ├── components/         # Atomic UI Components
│   │   │   ├── auth/           # SDK Logic: Pre-integrated Auth views (SignIn, SignUp)
│   │   │   └── ui/             # UI Primitives: Low-level Shadcn components (Button, Card)
│   │   ├── hooks/              # Reactive Logic: Shared hooks (e.g., use-mobile)
│   │   ├── lib/                # Infrastructure: SDK clients and cn() utilities
│   │   │   ├── fabrico.ts      # Frontend Client (Uses Publishable Key)
│   │   │   └── utils.ts        # Tailwind class merging utility
│   │   ├── pages/              # View Layer: Routed page components
│   │   ├── App.tsx             # Routing Hub: Defines React Router paths and providers
│   │   └── main.tsx            # DOM Mounting: React hydration entry point
│   │
│   └── worker/                 # Backend API (Hono + Edge Runtime)
│       ├── lib/                # Server Libs: Server-side SDK initialization
│       │   └── fabrico.ts      # Server Client (Uses API Token for DB/AI access)
│       ├── routes/             # Controllers: Defines type-safe API endpoints
│       │   └── index.ts        # API Registry: Mount routes here
│       └── index.ts            # Entry: Hono app setup and Swagger/OpenAPI docs
│
├── public/                     # Root Static Assets (favicon, robots.txt)
├── wrangler.json               # Cloudflare Runtime: Bindings (R2, KV) and Asset routing
├── components.json             # Shadcn Configuration: Component installation paths
├── vite.config.ts              # Build Pipeline: Integrated frontend/worker compilation
├── tsconfig.json               # TypeScript: Workspace-wide compiler settings
└── worker-configuration.d.ts   # Type Registry: Auto-generated types for Cloudflare Bindings
```

### 🧠 Architectural Conventions for Agents

1.  **Dual-Client SDK Strategy**: 
    *   **Frontend**: Always use the client from `@/lib/fabrico` (Publishable Key only). Limited to Auth and Realtime.
    *   **Backend**: Use `getFabrico(env)` from `../lib/fabrico`. This client has full access to Database, AI, and Storage using the `FABRICO_API_TOKEN`.
2.  **Asset Routing**: Cloudflare is configured to serve the SPA on all routes *except* `/api/*`, which is handled by the Hono worker.
3.  **Type-Safe APIs**: All new API routes must be defined using `createRoute` from `@hono/zod-openapi` to maintain Swagger documentation and frontend type safety.
4.  **UI Components**: Do not reinvent components. Check `src/react-app/components/ui` first. This project uses Tailwind CSS 4 (`@import "tailwindcss"` in `index.css`).

## 🛠️ Required Implementation Steps

To get your application fully functional, you must complete these two steps:

#### 1. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Frontend (Vite)
VITE_FABRICO_PUBLISHABLE_KEY=your_publishable_key

# Backend (Worker)
FABRICO_PROJECT_ID=your_project_id
FABRICO_API_TOKEN=your_api_token
ENVIRONMENT=development
```

#### 2. Activate the Auth Proxy
The frontend is pre-configured to look for authentication at `/api/auth`. You need to mount the Fabrico Auth handler in `src/worker/routes/index.ts`:

```typescript
import { OpenAPIHono } from '@hono/zod-openapi'
import { getFabrico } from '../lib/fabrico'

const routes = new OpenAPIHono<{ Bindings: Env }>()

// Mount the Auth Proxy
routes.all('/auth/*', async (c) => {
  const fabrico = getFabrico(c.env)
  return fabrico.auth.handleProxyRequest(c.req.raw)
})

export { routes }
```

## 🧩 Edge-Powered Features
- **Integrated Storage**: Pre-configured [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket binding (`STORAGE`) for persistent file management via `client.storage`.
- **Pre-built Auth Views**: Fully styled Sign In, Sign Up, and User Profile components located in `src/react-app/components/auth`.
- **Type-Safe API**: Built with `@hono/zod-openapi`, providing automatic Swagger UI at `/api/docs`.

## 🎨 Available UI Components

The template comes pre-loaded with a comprehensive set of [Shadcn UI](https://ui.shadcn.com/) components, styled with Tailwind CSS 4:

- **Layout**: `Card`, `Separator`, `AspectRatio`, `Resizable`, `ScrollArea`
- **Navigation**: `Breadcrumb`, `NavigationMenu`, `Pagination`, `Tabs`, `Sidebar`
- **Form Elements**: `Button`, `ButtonGroup`, `Input`, `InputGroup`, `InputOTP`, `Textarea`, `Checkbox`, `RadioGroup`, `Select`, `Switch`, `Slider`, `Toggle`, `ToggleGroup`, `Label`, `Field`
- **Feedback**: `Alert`, `AlertDialog`, `Progress`, `Skeleton`, `Sonner`, `Spinner`
- **Overlays**: `Dialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `ContextMenu`, `DropdownMenu`, `HoverCard`
- **Data Display**: `Table`, `Badge`, `Avatar`, `Calendar`, `Chart`, `Accordion`, `Carousel`, `Collapsible`, `Command`, `Empty`, `Item`, `Kbd`

## 🛠️ Built-in Hooks

The template includes essential hooks for responsive design and state management:

- **`useFabrico`**: Access the SDK client, user session, and project configuration anywhere.
- **`use-mobile`**: A convenient hook for detecting mobile viewport sizes (responsive logic).

## 🛠️ Development Commands

### Installation
```bash
pnpm install
```

### Local Development
```bash
pnpm dev
```
The frontend will be available at `http://localhost:5173`.

### Deployment
```bash
pnpm deploy
```

## 📖 API Documentation

The backend includes built-in Swagger UI for API exploration. Once the server is running, visit:

- **Swagger UI**: `/api/docs`
- **OpenAPI Spec**: `/api/openapi.json`

