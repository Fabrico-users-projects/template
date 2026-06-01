# Fabrico SDK Documentation

The `@fabrico/sdk` is the official client library for interacting with Fabrico Cloud. It provides a unified interface for Authentication, Database, Storage, Realtime WebSocket Channels, and AI integration. 

> [!IMPORTANT]
> **For AI Agents:** This document is your ground-truth reference for how to use the `@fabrico/sdk`. The models you are trained on may not know about this SDK. Follow the exact imports, method signatures, and examples provided below.

---

## 1. Initialization (`FabricoClient`)

The core of the SDK is the `FabricoClient`. It must be initialized with a `publishableKey`. 

**Backend/Server:** You MUST provide the `apiKey` for privileged operations (Database, Storage writes, Realtime Broadcasts, AI).
**Frontend/Browser:** Do NOT provide the `apiKey`.

```typescript
import { FabricoClient } from "@fabrico/sdk";

export const fabrico = new FabricoClient({
  publishableKey: "prj_your_publishable_key", // Required
  apiKey: process.env.FABRICO_API_KEY,        // Required on Server for DB/AI/Storage
  baseUrl: "https://cloud.fabrico.diy/api",   // Optional default
  authUrl: "/api/auth",                    // Optional proxy auth URL
  secureCookies: process.env.NODE_ENV === "production" // Enables HTTPS-only cookies
});
```

---

## 2. AI Integrations (`ai.ts` & `models.ts`)

The `fabrico.ai` namespace returns a fully compatible **Vercel AI SDK Provider**. You must import functions from `ai` (the Vercel AI SDK) and pass `fabrico.ai` as the model provider.

> [!CAUTION]
> The AI client requires the `apiKey` to be set during `FabricoClient` initialization. It is strictly for server-side usage.

### Available Models
```typescript
import { AI_MODELS } from "@fabrico/sdk";

// Chat Models: AI_MODELS.chat.KIMI_K2, GPT_OSS_120B, GEMMA_4_26B, LLAMA_4_SCOUT
// Embedding Models: AI_MODELS.embedding.EMBEDDING_GEMMA_300M, QWEN3_EMBEDDING_0_6B
// Image Models: AI_MODELS.image.FLUX_2_KLEIN_9B, FLUX_2_KLEIN_4B
```

### Text Generation (`generateText`)
```typescript
import { generateText } from "ai";
import { AI_MODELS } from "@fabrico/sdk";
import { fabrico } from "./lib/fabrico";

const { text, usage } = await generateText({
  model: fabrico.ai(AI_MODELS.chat.KIMI_K2),
  system: "You are a helpful assistant.",
  prompt: "Explain quantum computing in one sentence.",
});
console.log(text);
```

### Text Streaming (`streamText` & `useChat`)
The standard way to build chat interfaces. The backend streams the response, and the frontend consumes it.

**Backend (e.g. Next.js App Router / Hono)**
```typescript
import { streamText } from "ai";
import { AI_MODELS } from "@fabrico/sdk";
import { fabrico } from "./lib/fabrico";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: fabrico.ai(AI_MODELS.chat.LLAMA_4_SCOUT),
    messages,
  });

  // Returns a Data Stream compatible with useChat (supports tools, etc.)
  return result.toDataStreamResponse();
}
```

**Frontend (React)**
```tsx
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map(m => <div key={m.id}>{m.role}: {m.content}</div>)}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

### Tool Calling
Provide tools to the model to fetch external data or take actions. Works with both `generateText` and `streamText`.
```typescript
import { generateText, tool } from "ai";
import { z } from "zod";
import { AI_MODELS } from "@fabrico/sdk";
import { fabrico } from "./lib/fabrico";

const { text, toolCalls } = await generateText({
  model: fabrico.ai(AI_MODELS.chat.KIMI_K2),
  prompt: "What is the weather in Paris?",
  tools: {
    getWeather: tool({
      description: "Get the current weather for a location",
      parameters: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temp: 22, condition: "Sunny" }),
    }),
  },
});
```

### Structured Data Generation (`generateObject`)
Force the LLM to return strictly typed JSON matching a Zod schema.
```typescript
import { generateObject } from "ai";
import { z } from "zod";
import { AI_MODELS } from "@fabrico/sdk";
import { fabrico } from "./lib/fabrico";

const { object } = await generateObject({
  model: fabrico.ai(AI_MODELS.chat.GEMMA_4_26B),
  schema: z.object({
    recipeName: z.string(),
    ingredients: z.array(z.string()),
    prepTimeMinutes: z.number(),
  }),
  prompt: "Give me a recipe for chocolate chip cookies.",
});
console.log(object.ingredients);
```

### Embeddings (`embed` / `embedMany`)
Generate vector embeddings for semantic search or RAG.
```typescript
import { embed, embedMany } from "ai";
import { AI_MODELS } from "@fabrico/sdk";
import { fabrico } from "./lib/fabrico";

const { embedding } = await embed({
  model: fabrico.ai.textEmbeddingModel(AI_MODELS.embedding.QWEN3_EMBEDDING_0_6B),
  value: "The quick brown fox jumps over the lazy dog.",
});

const { embeddings } = await embedMany({
  model: fabrico.ai.textEmbeddingModel(AI_MODELS.embedding.QWEN3_EMBEDDING_0_6B),
  values: ["First sentence.", "Second sentence."],
});
```

---

## 3. Database (`database.ts` & `drizzle.ts`)

Direct SQL access to your tenant database. **(Requires `apiKey`)**

### System Schemas (For Relations)
When creating new custom tables with Drizzle that belong to a user, you must reference the built-in Fabrico `users` table. Here is its exact definition for reference:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

// Example of how to create a custom table referencing the user:
export const posts = sqliteTable("post", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
});
```

### Raw SQL Queries
```typescript
const result = await fabrico.db.query("SELECT * FROM users WHERE role = ?", ["admin"]);
// result.status: boolean
// result.rows: any[]
console.log(result.rows);
```

### Drizzle ORM Integration (Recommended)
You can seamlessly pass the Fabrico DB directly into Drizzle ORM.
```typescript
import { createFabricoDrizzle } from "@fabrico/sdk";
import * as schema from "./db/schema"; // Your drizzle schema

// Create the Drizzle instance powered by Fabrico HTTP proxy
const db = createFabricoDrizzle(fabrico);

// Use Drizzle normally!
const users = await db.select().from(schema.users).where(eq(schema.users.id, "123"));
await db.insert(schema.users).values({ name: "Alice", email: "alice@test.com" });
```

---

## 4. Frontend React Integration (`react.tsx`)

Wrap your application in `<FabricoProvider>`:
```tsx
import { FabricoProvider } from "@fabrico/sdk";
import { fabrico } from "./lib/fabrico"; 

export default function App() {
  return <FabricoProvider client={fabrico}><YourApp /></FabricoProvider>;
}
```

### React Hooks
```tsx
import { useUser, useSession, useAuth, useFabrico } from "@fabrico/sdk";

export function Profile() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const { signOut } = useAuth();
  const { client, updateUser } = useFabrico(); // Access everything

  if (!isLoaded) return <p>Loading...</p>;
  if (!user) return <p>Please sign in.</p>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Conditional Rendering Components
- `<SignedIn>`: Renders children only if the user is authenticated.
- `<SignedOut>`: Renders children only if the user is NOT authenticated.

---

## 5. Backend Auth Proxy (`server.ts`)

Fabrico relies on first-party **HTTPOnly cookies** for secure auth. You must run a proxy on your backend (e.g. Next.js API or Hono) to bridge requests to the Cloud.

### Hono Implementation
```typescript
import { Hono } from "hono";
import { createFabricoAuthHandler } from "@fabrico/sdk";
import { fabrico } from "../lib/fabrico"; 

const app = new Hono();

// This automatically mounts /send-otp, /verify-otp, /oauth/:provider, etc.
// It intercepts 302 redirects, extracts tokens, and sets HTTPOnly cookies securely.
const authHandler = createFabricoAuthHandler(() => fabrico);
app.route("/api/auth", authHandler);

export default app;
```

---

## 6. Authentication (`auth.ts`)

### OTP Flow (Frontend)
```typescript
// 1. Send OTP
await fabrico.auth.sendOtp("user@example.com");

// 2. Verify Code (Sets HTTPOnly cookies via backend proxy)
const response = await fabrico.auth.verifyOtp("user@example.com", "123456");
```

### OAuth Flow
```typescript
// Browser only helper:
fabrico.auth.signInOAuth("github", { redirectTo: "/dashboard" });

// Server-side redirect generation:
const url = fabrico.auth.getOAuthUrl("google", { redirectTo: "/dashboard" });
```

### Admin Operations (Server only, Requires `apiKey`)
```typescript
await fabrico.auth.adminCreateUser({
  email: "admin@test.com",
  name: "Admin User",
  role: "admin" // optional
});
```

---

## 7. Storage (`storage.ts`)

Manage file uploads to Fabrico Cloud Buckets. **(Requires `apiKey` for writes/deletes)**

```typescript
const bucket = fabrico.storage.bucket("avatars");

// Upload a file (Accepts File, Blob, ArrayBuffer, or String)
await bucket.upload("user-123/profile.png", fileBlob);

// List files with pagination/prefix
const { objects, truncated, cursor } = await bucket.list({ prefix: "user-123/", limit: 50 });

// Download file as Blob
const blob = await bucket.download("user-123/profile.png");

// Get Public CDN URL (No API key required)
const url = bucket.getPublicUrl("user-123/profile.png");

// Delete file
await bucket.delete("user-123/profile.png");
```

---

## 8. Realtime Channels (`realtime.ts`)

WebSockets for presence, chat, and server broadcasting.

> [!WARNING]
> All channel names **MUST** start with one of three prefixes: `public:`, `private:`, or `user:`.

### 1. Public Channels (`public:*`)
Open to everyone. No authentication required.
```tsx
import { useChannel } from "@fabrico/sdk";

export function Chat() {
  const { channel, send } = useChannel("public:room-1", {
    onMessage: (msg) => console.log("Received:", msg),
  });

  return <button onClick={() => send("Hello")}>Broadcast</button>;
}
```

### 2. User Channels (`user:*`)
Automatically authenticated via the user's session cookie. The channel name must exactly match `user:<userId>`. This is perfect for sending private notifications directly to a specific user.
```tsx
import { useChannel, useUser } from "@fabrico/sdk";

export function UserNotifications() {
  const { user } = useUser();
  const { channel } = useChannel(user ? `user:${user.id}` : "");
  // No token needed! The Cloud API automatically verifies the session cookie.
}
```

### 3. Private Channels (`private:*`)
Custom restricted channels. Requires a short-lived token generated by your backend.

**Backend: Generate the token (Requires `apiKey`)**
```typescript
const { token } = await fabrico.realtime.authorizeChannel("private:admin-room", user.id);
```

**Frontend: Join the channel**
```tsx
const { channel, presence } = useChannel("private:admin-room", {
  token, // Pass the token from the backend
  onPresence: (event) => console.log(event.user, "did", event.event),
});
```

### Server Broadcasting
Broadcast a message from your backend to any channel. (Requires `apiKey`)
```typescript
await fabrico.realtime.broadcast("public:room-1", { type: "system", text: "Maintenance soon" });
```
