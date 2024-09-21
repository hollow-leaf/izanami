import '@phala/wapo-env'
import { Hono } from 'hono/tiny'
import { html, raw } from 'hono/html'
import { handle } from '@phala/wapo-env/guest'
import viem, {createPublicClient, http, parseAbi} from 'viem'
import { flowTestnet } from 'viem/chains'

export const app = new Hono()
const client = createPublicClient({ 
  chain: flowTestnet, 
  transport: http('https://testnet.evm.nodes.onflow.org')
}) 
async function getChatCompletion(apiKey: string, model: string, chatQuery: string) {
  let result = ''
  try {
    const response = await fetch('https://api.red-pill.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: `${chatQuery}` }],
        model: `${model}`,
      })
    });
    const responseData = await response.json();
    result = (responseData.error) ? responseData.error : responseData.choices[0].message.content
  } catch (error) {
    console.error('Error fetching chat completion:', error)
    result = error as string
  }
  return result
}

app.get('/', async (c) => {
  let vault: Record<string, string> = {}
  let queries = c.req.queries() || {}
  try {
    vault = JSON.parse(process.env.secret || '')
  } catch (e) {
    console.error(e)
    return c.json({ error: "Failed to parse secrets" })
  }
  const apiKey = (vault.apiKey) ? vault.apiKey : 'sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2'
  // Choose from any model listed here https://docs.red-pill.ai/get-started/supported-models
  const model = (queries.model) ? queries.model[0] : 'gpt-4o'
  let reputation = "0,0"
// try {
  //   const address_query = queries.address ? queries.address[0] : ''
  

  //   const reputation = await client.readContract({
  //     address: '0xe3a6b8Da8932354592E7F3f6199b82D6E2bdBDb2' ,
  //     abi: parseAbi(['function getReputation(address) view returns (uint256, uint256)']),
  //     functionName: 'getReputation',
  //     args: [address_query]
  //   })
  // } catch (error) {
  //   console.error('Error fetching chat completion:', error)
  // }  // 
  // 0, 0 
  console.log(reputation.toString())
  const rep = reputation.toString().split(',')

  const prompt = `Help me alalysis this address: ${queries.address}, and rate this address from 1 to 100, 100 is the highest.
  We have some data about this address: ${queries.data}, Good Reputation: ${rep[0]}, Bad Reputation: ${rep[1]}, please use this data to help analysis the address.`

  // try {
  //   await fetch('https://greenpower.wayneies1206.workers.dev/addressStatus/uploadai', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       "address": queries.address,
  //       "value": prompt
  //     })
  //   });
  // } catch (error) {
  //   console.error('Error fetching chat completion:', error)
  // }

  let result = {
    model,
    chatQuery: prompt,
    message: ''
  };

  result.message = await getChatCompletion(apiKey, model, prompt)

  return c.json(result)
})

app.post('/', async (c) => {
  let vault: Record<string, string> = {}
  const data = await c.req.json()
  console.log('user payload in JSON:', data)
  try {
    vault = JSON.parse(process.env.secret || '')
  } catch (e) {
    console.error(e)
    return c.json({ error: "Failed to parse secrets" })
  }

  const apiKey = (vault.apiKey) ? vault.apiKey : 'sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2'
  const model = (data.model) ? data.model : 'gpt-4o'
  const prompt = `Help me alalysis this address: ${data.address}, and rate this address from 1 to 100, 100 is the highest.
  We have some data about this address: ${data.data}, please use this data to help analysis the address. Note: if data is undefined, give me a 70 number`

  // try {
  //   await fetch('https://greenpower.wayneies1206.workers.dev/addressStatus/uploadai', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       "address": data.address,
  //       "value": prompt
  //     })
  //   });
  // } catch (error) {
  //   console.error('Error fetching chat completion:', error)
  // }
  let result = {
    model,
    chatQuery: prompt,
    message: ''
  };

  result.message = await getChatCompletion(apiKey, model, prompt)

  return c.json(result)
});

export default handle(app)
