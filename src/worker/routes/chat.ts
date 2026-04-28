import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const chat = new OpenAPIHono<{ Bindings: Env }>()

const sendRoute = createRoute({
  method: 'post',
  path: '/send',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            namespace: z.string().default('chat'),
            author: z.string(),
            text: z.string().min(1),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ ok: z.boolean() }) } },
      description: 'Message broadcast',
    },
  },
})

chat.openapi(sendRoute, async (c) => {
  const { namespace, author, text } = c.req.valid('json')
  await c.env.SOCKET.publish(namespace, 'message', {
    author,
    text,
    timestamp: Date.now(),
  })
  return c.json({ ok: true })
})

// Proxy WebSocket upgrade to the supervisor's /socket handler
chat.get('/ws', (c) => {
  const namespace = c.req.query('namespace') ?? 'chat'
  const upstream = new Request(
    `https://fabrico-supervisor/socket?namespace=${encodeURIComponent(namespace)}`,
    c.req.raw,
  )
  return c.env.SUPERVISOR.fetch(upstream)
})

export default chat
