import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LogoutButton, Protected, useAuth } from './auth'
import { CustomerDetailsPage } from './pages/CustomerDetailsPage'
import { CustomerFormPage } from './pages/CustomerFormPage'
import { CustomersPage } from './pages/CustomersPage'
import { LoginPage } from './pages/LoginPage'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })

function Layout({ children }: { children: ReactNode }) {
  const auth = useAuth()
  return <div className="app-shell"><header className="app-header"><Link to="/customers" className="brand">Starter<span> / Customers</span></Link>
    <div className="header-actions"><span>{auth.data?.email}</span><LogoutButton /></div></header>{children}</div>
}

function App() {
  return <QueryClientProvider client={queryClient}><BrowserRouter><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/customers" element={<Protected><Layout><CustomersPage /></Layout></Protected>} />
    <Route path="/customers/new" element={<Protected><Layout><CustomerFormPage /></Layout></Protected>} />
    <Route path="/customers/:id/edit" element={<Protected><Layout><CustomerFormPage /></Layout></Protected>} />
    <Route path="/customers/:id" element={<Protected><Layout><CustomerDetailsPage /></Layout></Protected>} />
    <Route path="*" element={<Navigate to="/customers" replace />} />
  </Routes></BrowserRouter></QueryClientProvider>
}

export default App
