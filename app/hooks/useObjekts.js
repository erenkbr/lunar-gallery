import { useQuery } from '@tanstack/react-query'
import { useWalletStore } from '@/app/store/slices/walletSlice'
import { useObjektsStore } from '@/app/store/slices/objektSlice'
import { useEffect } from 'react'

export function useObjekts() {
  const walletAddress = useWalletStore(state => state.walletAddress)
  const { setObjekts } = useObjektsStore()

  const query = useQuery({
    queryKey: ['objekts', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return []
      
      const response = await fetch(`/api/objekts?address=${walletAddress}`)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      return data.objekts
    },
    enabled: !!walletAddress,
  })

  useEffect(() => {
    if (query.data) {
      setObjekts(query.data)
    }
  }, [query.data, setObjekts])

  return query
}
