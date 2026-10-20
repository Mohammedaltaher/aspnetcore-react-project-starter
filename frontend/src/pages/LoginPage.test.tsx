import { afterEach, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './LoginPage'

afterEach(() => vi.unstubAllGlobals())

it('submits credentials with the CSRF header and opens the protected area', async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
  vi.stubGlobal('fetch', fetchMock)
  const user = userEvent.setup()
  render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={['/login']}><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/customers" element={<p>Customer screen</p>} />
  </Routes></MemoryRouter></QueryClientProvider>)
  await user.type(screen.getByLabelText('Email'), 'admin@example.com')
  await user.type(screen.getByLabelText('Password'), 'Strong-Password-123!')
  await user.click(screen.getByRole('button', { name: 'Sign in' }))
  expect(await screen.findByText('Customer screen')).toBeTruthy()
  expect(fetchMock).toHaveBeenCalledWith('/api/v1/auth/login', expect.objectContaining({
    credentials: 'include',
    method: 'POST',
    headers: expect.objectContaining({ 'X-CSRF': '1' }),
  }))
})
