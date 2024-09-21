import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ethers } from 'ethers'

const QuerySchema = z.object({
})

const ResponseSchema = z.object({
  message: z.string(),
})

const ResponseErrorSchema = z.object({
  error: z.literal('Invalid data!'),
})

const route = createRoute({
  method: 'post',
  path: '/check_sign',
  request: { query: QuerySchema },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
          example: {
            message: 'Successfully added admin to the list of admins!',
          },
        },
      },
      description: 'The response when a user has been successfully added.',
    },
    401: {
      content: {
        'text/plain': { schema: z.literal('Unauthorized') },
      },
      description: 'The response when the request is unauthorized.',
    },
    500: {
      content: {
        'application/json': { schema: ResponseErrorSchema },
      },
      description: 'The response when a user cannot be added.',
    },
  },
})

export const check_sign = new OpenAPIHono<any>().openapi(route, async (context) => {
  const message = context.req.query('message')
  const signature = context.req.query('signature')
  const expectedAddress = context.req.query('address')
  
  const recoveredAddress = ethers.utils.verifyMessage(message, signature);
  
  if (recoveredAddress === expectedAddress) {
    return context.json({ message: '签名有效' }, 200);
  } else {
    return context.json({ message: '签名无效' }, 400);
  }
});
