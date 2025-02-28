import { useQuery } from '@tanstack/react-query';
import { useObjektsStore } from '@/app/store/slices/objektSlice';

export function useFilters() {
  const { selectedGroup } = useObjektsStore();

  const query = useQuery({
    queryKey: ['filters', selectedGroup],
    queryFn: async () => {
      const response = await fetch(`/api/filters?group=${selectedGroup}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch filters: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return query;
}