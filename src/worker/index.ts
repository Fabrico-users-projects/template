import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { routes } from './routes'


const app = new OpenAPIHono<{ Bindings: Env }>()

app.route('/api', routes)

app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }))

app.doc('/api/openapi.json', {
	openapi: '3.0.0',
	info: { version: '1.0.0', title: 'Fabrico API' },
})

export default app
