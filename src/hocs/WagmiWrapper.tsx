import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi'
import { localhost, arbitrum } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { WalletEvmDialogProvider } from './WalletEvmDialogProvider';
import { TransactionEvmStateProvider } from './TransactionEvmStateProvider';


export const WagmiConfig = createConfig({
  chains: [arbitrum], //[localhost, arbitrum, arbitrumSepolia],
  connectors: [
    injected(),
    // metaMask(),
    // walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID! }),
    // coinbaseWallet()
  ],
  transports: {
    // [localhost.id]: http(),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL),
    // [arbitrumSepolia.id]: http(),
    // [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL)
  }
});

const queryClient = new QueryClient()
const WagmiWrapper = ({ children }: { children: React.ReactNode }) => {

  return (
    <WagmiProvider config={WagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TransactionEvmStateProvider>
          <WalletEvmDialogProvider>
            {children}
          </WalletEvmDialogProvider>
        </TransactionEvmStateProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default WagmiWrapper
