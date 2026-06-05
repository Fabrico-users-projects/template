import { OpenAPIHono } from '@hono/zod-openapi'

const routes = new OpenAPIHono<{ Bindings: Env }>()

export { routes }
