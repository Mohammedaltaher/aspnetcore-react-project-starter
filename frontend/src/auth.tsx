import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api, ApiError } from './api/client'
import { Button } from './components/ui/button'
import { FeedbackBanner, LoadingState } from './components/patterns'
import type { ReactNode } from 'react'

export function useAuth() {
  return useQuery({
    queryKey: ['auth'], queryFn: api.me, retry: false, staleTime: 30_000,
  })
}

export function Protected({ children }: { children: ReactNode }) {
  const auth = useAuth()
  if (auth.isPending) return <main className="page"><LoadingState label="Checking your session…" /></main>
  if (auth.error instanceof ApiError && auth.error.status === 401) return <Navigate to="/login" replace />
  if (auth.isError) return <main className="page"><FeedbackBanner tone="error">Could not connect to the API. <Button variant="link" onClick={() => auth.refetch()}>Try again</Button></FeedbackBanner></main>
  return <>{children}</>
}

export function LogoutButton() {
  const cache = useQueryClient()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  return <Button variant="outline" onClick={async () => {
    try { await api.logout(); cache.clear(); navigate('/login') }
    catch { setError('Could not log out. Try again.') }
  }}>{error || 'Log out'}</Button>
}
