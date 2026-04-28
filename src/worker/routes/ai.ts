import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { stepCountIs } from 'ai'

const ai = new OpenAPIHono<{ Bindings: Env }>()

// ── /api/ai/generate — stream a text response ─────────────────────────────

const generateRoute = createRoute({
  method: 'post',
  path: '/generate',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            prompt: z.string(),
            model: z.enum(['kimi', 'llama4']).optional().default('kimi'),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'UI message stream' },
  },
})

ai.openapi(generateRoute, async (c) => {
  const { prompt, model } = c.req.valid('json')
  return c.env.AI.streamText({ model, prompt, webAccess: false })
})

// ── /api/ai/agent — stream with web-search system prompt ─────────────────

const agentRoute = createRoute({
  method: 'post',
  path: '/agent',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            prompt: z.string(),
            model: z.enum(['kimi', 'llama4']).optional().default('kimi'),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'Agent UI message stream' },
  },
})

ai.openapi(agentRoute, async (c) => {
  const { prompt, model } = c.req.valid('json')
  const { text } =  await c.env.AI.generateText({
    model,
    webAccess: true,
    systemPrompt:
      `You are a helpful AI assistant. u have web search tool, Search the web whenever you need up-to-date or specific information before answering. current Date ${Date.now()}`,
    prompt,
    stopWhen: stepCountIs(5)
  })
  return c.json({
    text
  })
})

// ── /api/ai/image — generate an image and return it as PNG ───────────────

const imageRoute = createRoute({
  method: 'post',
  path: '/image',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ prompt: z.string() }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'image/png': {
          schema: z.string().openapi({ format: 'binary' }),
        },
      },
      description: 'Generated PNG image',
    },
  },
})

ai.openapi(imageRoute, async (c) => {
  const { prompt } = c.req.valid('json')
  const bytes = await c.env.AI.generateImage(prompt)
  return new Response(bytes, {
    headers: { 'Content-Type': 'image/png' },
  })
})

// ── /api/ai/embed — single embedding ─────────────────────────────────────

const embedRoute = createRoute({
  method: 'post',
  path: '/embed',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ text: z.string() }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ embedding: z.array(z.number()) }),
        },
      },
      description: 'Embedding vector',
    },
  },
})

ai.openapi(embedRoute, async (c) => {
  const { text } = c.req.valid('json')
  const result = await c.env.AI.getEmbedding(text)
  return c.json(result, 200)
})

// ── /api/ai/embeddings — batch embeddings ────────────────────────────────

const embeddingsRoute = createRoute({
  method: 'post',
  path: '/embeddings',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ texts: z.array(z.string()).min(1).max(100) }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ embeddings: z.array(z.array(z.number())) }),
        },
      },
      description: 'Embedding vectors',
    },
  },
})

ai.openapi(embeddingsRoute, async (c) => {
  const { texts } = c.req.valid('json')
  const result = await c.env.AI.getEmbeddings(texts)
  return c.json(result, 200)
})

export default ai
