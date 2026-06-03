# Vite + React + Hono + Cloudflare Workers Template

A modern, full-stack boilerplate for building high-performance applications on the Cloudflare edge. Powered by the [Fabrico SDK](https://fabrico.diy) for seamless authentication, database access, and AI integration.

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [React Router 7](https://reactrouter.com/), [Radix UI](https://www.radix-ui.com/).
- **Backend**: [Hono](https://hono.dev/) with [Zod OpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) for type-safe APIs.
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) with [Cloudflare Assets](https://developers.cloudflare.com/workers/static-assets/).
- **SDK**: [@fabrico/sdk](https://www.npmjs.com/package/@fabrico/sdk) for Auth, DB, AI models, and Realtime sync.

## 📂 Project Structure

A highly modularized directory layout separating frontend concerns from edge-native backend logic.

```text
.
├── src/
│   ├── react-app/              # Frontend: Vite + React SPA
│   │   ├── assets/             # Static assets (images, icons)
│   │   ├── components/         # React Components
│   │   │   ├── auth/           # SDK-powered Auth views (SignIn, SignUp, UserProfile)
│   │   │   └── ui/             # Reusable UI primitives (Buttons, Cards, etc.)
│   │   ├── lib/                # Shared logic & configurations
│   │   │   ├── fabrico.ts      # Frontend SDK initialization (Publishable Key only)
│   │   │   └── utils.ts        # Tailwind merge & utility functions
│   │   ├── pages/              # Routed view components
│   │   │   ├── Home.tsx        # Dashboard / Landing page
│   │   │   └── NotFound.tsx    # 404 Error page
│   │   ├── App.tsx             # Main application router & providers
│   │   └── main.tsx            # React hydration & entry point
│   │
│   └── worker/                 # Backend: Hono + Cloudflare Worker
│       ├── lib/                # Backend utilities
│       │   └── fabrico.ts      # Server-side SDK client (API Key + DB/AI access)
│       ├── routes/             # API Endpoint definitions
│       │   ├── hello.ts        # Sample Zod-OpenAPI route
│       │   └── index.ts        # Route registry and orchestration
│       └── index.ts            # Hono application entry & Swagger setup
│
├── public/                     # Static assets served by Cloudflare
├── wrangler.json               # Cloudflare Workers configuration & bindings
├── vite.config.ts              # Vite configuration with Cloudflare integration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies and scripts
```

## 🧩 Architectural Implementation

### Shared SDK Client (`@fabrico/sdk`)
The project utilizes a dual-client strategy to maintain security while enabling high-performance features:

- **Client-Side (`src/react-app/lib/fabrico.ts`)**: Initializes with a `publishableKey`. It manages session state and interacts with the Hono auth proxy for secure, cookie-based authentication.
- **Server-Side (`src/worker/lib/fabrico.ts`)**: Initializes per-request with an `apiKey`. This client has privileged access to the Database, AI models, and Storage management.

### Type-Safe API via Hono
The backend uses `@hono/zod-openapi` to ensure that every API endpoint is fully typed and self-documenting.
- **Validation**: Requests are validated at the edge using Zod schemas.
- **Documentation**: Swagger UI is automatically generated and accessible at `/api/docs`.
- **Performance**: Leveraging Cloudflare Workers for global low-latency response times.

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)
- [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

```bash
pnpm install
```

### Local Development

Start both the frontend and the worker locally:

```bash
pnpm dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:5173/api`.

### Deployment

Deploy your application to Cloudflare:

```bash
pnpm deploy
```

### Edge-Powered Features
- **Integrated Storage**: Pre-configured [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket binding (`STORAGE`) for persistent file management via `client.storage`.
- **Global Auth Proxy**: A secure `/api/auth` gateway that leverages the SDK to handle `httpOnly` session management.
- **Component System**: Pre-configured UI components based on [Radix UI](https://www.radix-ui.com/) and Tailwind CSS, following a modular architecture (see `components.json`).

## 🔐 Environment Variables

Create a `.env` file (or set via Wrangler) with the following:

```env
# Frontend (Vite)
VITE_FABRICO_PUBLISHABLE_KEY=your_publishable_key

# Backend (Worker)
FABRICO_PROJECT_ID=your_project_id
FABRICO_API_TOKEN=your_api_token
ENVIRONMENT=development
```

## 📖 API Documentation

The backend includes built-in Swagger UI for API exploration. Once the server is running, visit:

- **Swagger UI**: `/api/docs`
- **OpenAPI Spec**: `/api/openapi.json`
