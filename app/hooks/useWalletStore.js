import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWalletStore = create(
  persist(
    (set) => ({
      walletAddress: '',
      setWalletAddress: (address) => set({ walletAddress: address }),
      clearWallet: () => set({ walletAddress: '' }),
    }),
    {
      name: 'wallet-storage',
    }
  )
)