import { createAppKit } from '@reown/appkit/react'
import { ReactNode } from "react"
import { WagmiProvider } from 'wagmi'
import { mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

interface AppKitProviderProps {
    children: ReactNode;
  }

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = '6dff28028dd879fe872f98d558bfe797'

// 2. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'http://localhost:5173', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const networks = [mainnet]
// 3. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  networks,
  projectId
})

// 4. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [{id: "eip155:545", chainId: "flow:testnet", chainNamespace: "eip155", "rpcUrl": "https://testnet.evm.nodes.onflow.org", currency: "FLOW", name: "EVM on Flow Testnet", explorerUrl: "https://evm-testnet.flowscan.io", imageUrl: "https://cryptologos.cc/logos/flow-flow-logo.png?v=035", imageId: "Flow"}],
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  allowUnsupportedChain: true
})

export function AppKitProvider({ children }: AppKitProviderProps) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}