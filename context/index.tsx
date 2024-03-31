import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { type Chain } from 'viem'
import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const galadiel_dev = {
    id: 696969,
    name: 'Galadriel',
    nativeCurrency: { name: 'Galadiel', symbol: 'GAL', decimals: 18 },
    blockExplorers: {
        default: { name: 'Etherscan', url: 'https://explorer.galadriel.com' },
    },
    rpcUrls: {
        default: { http: ['https://devnet.galadriel.com/'] },
    },
} as const satisfies Chain

const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig

// Create wagmiConfig
const chains = [mainnet, sepolia, galadiel_dev] as const
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true// Optional - Override createConfig parameters
});