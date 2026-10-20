import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from './api/client'

export function createQueryClient() {
  let client: QueryClient
  const refreshAuth = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401) {
      void client.invalidateQueries({ queryKey: ['auth'] })
    }
  }
  client = new QueryClient({
    queryCache: new QueryCache({ onError: (error, query) => {
      if (query.queryKey[0] !== 'auth') refreshAuth(error)
    } }),
    mutationCache: new MutationCache({ onError: refreshAuth }),
    defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
  })
  return client
}
