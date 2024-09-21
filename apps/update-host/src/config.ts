import 'dotenv/config'

export const get_config = () => {
  return {
    INFURA_API_KEY: process.env.INFURA_API_KEY,
  }
}