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
  method: 'get',
  path: '/update_address',
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

export const update_address = new OpenAPIHono<any>().openapi(route, async (context) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "address": "0xf3419771c2551f88a91Db61cB874347f05640172",
    "good": 100,
    "bad": 15
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("https://greenpower.wayneies1206.workers.dev/addressStatus/upload", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    
  return context.json({ message: 'Successfully!' })
});
