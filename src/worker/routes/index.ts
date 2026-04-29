import { OpenAPIHono } from '@hono/zod-openapi'
import hello from './hello'

const routes = new OpenAPIHono<{ Bindings: Env }>()

routes.route('/hello-Fabrico', hello)

export { routes }
