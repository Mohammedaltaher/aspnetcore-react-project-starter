import type { components } from './schema'

export type Customer = components['schemas']['CustomerDto']
export type CustomerInput = components['schemas']['CustomerInput']
export type CustomerPage = components['schemas']['PagedResultOfCustomerDto']
export type AuthUser = { email: string; isAdmin: boolean }

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(!['GET', 'HEAD'].includes(init.method ?? 'GET') ? { 'X-CSRF': '1' } : {}),
      ...init.headers,
    },
  })
  if (response.status === 204) return undefined as T
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const details = data as { title?: string; detail?: string; errors?: Record<string, string[]> } | null
    throw new ApiError(response.status, details?.detail || Object.values(details?.errors ?? {}).flat().join(' ') || details?.title || `Request failed (${response.status})`)
  }
  return data as T
}

export const api = {
  me: () => request<AuthUser>('/api/v1/auth/me'),
  login: (email: string, password: string) => request<void>('/api/v1/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  }),
  logout: () => request<void>('/api/v1/auth/logout', { method: 'POST' }),
  customers: (params: { search: string; sort: string; page: number }) => {
    const query = new URLSearchParams({ search: params.search, sort: params.sort, page: String(params.page), pageSize: '10' })
    return request<CustomerPage>(`/api/v1/customers?${query}`)
  },
  customer: (id: string) => request<Customer>(`/api/v1/customers/${id}`),
  createCustomer: (input: CustomerInput) => request<Customer>('/api/v1/customers', { method: 'POST', body: JSON.stringify(input) }),
  updateCustomer: (id: string, input: CustomerInput) => request<Customer>(`/api/v1/customers/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  deleteCustomer: (id: string) => request<void>(`/api/v1/customers/${id}`, { method: 'DELETE' }),
}
