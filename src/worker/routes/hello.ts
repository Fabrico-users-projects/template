import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const hello = new OpenAPIHono<{ Bindings: Env }>()

const HelloSchema = z.object({
  message: z.string().openapi({ example: 'Hello, Fabrico!' }),
}).openapi('Hello')

const helloRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: { 'application/json': { schema: HelloSchema } },
      description: 'Hello Fabrico',
    },
  },
})

hello.openapi(helloRoute, (c) => {
  return c.json({ message: 'Hello, Fabrico!' })
})

export default hello
