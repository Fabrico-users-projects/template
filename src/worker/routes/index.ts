import { OpenAPIHono } from '@hono/zod-openapi'
import hello from './hello'
import ai from './ai'

const routes = new OpenAPIHono<{ Bindings: Env }>()

routes.route('/hello-Fabrico', hello)

routes.route('/ai', ai)

export { routes }
