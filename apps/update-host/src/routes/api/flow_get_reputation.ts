import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ethers } from 'ethers'

const QuerySchema = z.object({
  address: z.string(),
})

const ResponseSchema = z.object({
  message: z.string(),
})

const ResponseErrorSchema = z.object({
  error: z.literal('Invalid data!'),
})

const route = createRoute({
  method: 'get',
  path: '/flow_get_reputation',
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

export const flow_get_reputation = new OpenAPIHono<any>().openapi(route, async (context) => {
  const address = context.req.query('address')
  const provider = new ethers.providers.JsonRpcProvider('https://testnet.evm.nodes.onflow.org')
  const contract = new ethers.Contract('0xe3a6b8Da8932354592E7F3f6199b82D6E2bdBDb2', ['function getReputation(address) view returns (uint256, uint256)'], provider)
  const reputation = await contract.getReputation(address)
  console.log(reputation.toString())
  return context.json({ message: reputation.toString() }, 200);
});
