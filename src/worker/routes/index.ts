import { OpenAPIHono } from '@hono/zod-openapi'
import hello from './hello'
import chat from './chat'

const routes = new OpenAPIHono<{ Bindings: Env }>()

routes.route('/hello-Fabrico', hello)
routes.route('/chat', chat)

export { routes }
