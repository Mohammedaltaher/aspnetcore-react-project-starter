import { expect, it } from 'vitest'
import { ApiError } from './api/client'
import { createQueryClient } from './queryClient'

it('checks the session after a customer request receives 401', async () => {
  const client = createQueryClient()
  client.setQueryData(['auth'], { email: 'user@example.com', isAdmin: false })
  await expect(client.fetchQuery({
    queryKey: ['customers'],
    queryFn: () => Promise.reject(new ApiError(401, 'Unauthorized')),
    retry: false,
  })).rejects.toBeInstanceOf(ApiError)
  expect(client.getQueryState(['auth'])?.isInvalidated).toBe(true)
  client.clear()
})
