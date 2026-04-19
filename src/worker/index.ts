import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { routes } from './routes'

const app = new OpenAPIHono<{ Bindings: Env }>()

app.route('/api', routes)

app.get('/ui', swaggerUI({ url: '/doc' }))

app.doc('/doc', {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Diali API' },
})

export default app
