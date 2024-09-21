import { OpenAPIHono } from '@hono/zod-openapi'
import { check_sign } from './check_sign'
import { add_data } from './add_data'

const api = new OpenAPIHono()

api
  .use('/api/*')
  .route('/api', check_sign)
  .route('/api', add_data)

export { api }
