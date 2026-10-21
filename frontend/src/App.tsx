import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Protected, useAuth } from './auth'
import { AppShell } from './components/AppShell'
import { CustomerDetailsPage } from './pages/CustomerDetailsPage'
import { CustomerFormPage } from './pages/CustomerFormPage'
import { CustomersPage } from './pages/CustomersPage'
import { LoginPage } from './pages/LoginPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { DashboardPreviewPage } from './pages/DashboardPreviewPage'
import { createQueryClient } from './queryClient'

const queryClient = createQueryClient()

function Layout({ children }: { children: ReactNode }) {
  const auth = useAuth()
  return <AppShell email={auth.data?.email}>{children}</AppShell>
}

function App() {
  return <QueryClientProvider client={queryClient}><BrowserRouter><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/design-system" element={<AppShell preview section="Dashboard"><DashboardPreviewPage /></AppShell>} />
    <Route path="/components" element={<AppShell preview section="Components"><DesignSystemPage /></AppShell>} />
    <Route path="/customers" element={<Protected><Layout><CustomersPage /></Layout></Protected>} />
    <Route path="/customers/new" element={<Protected><Layout><CustomerFormPage /></Layout></Protected>} />
    <Route path="/customers/:id/edit" element={<Protected><Layout><CustomerFormPage /></Layout></Protected>} />
    <Route path="/customers/:id" element={<Protected><Layout><CustomerDetailsPage /></Layout></Protected>} />
    <Route path="*" element={<Navigate to="/design-system" replace />} />
  </Routes></BrowserRouter></QueryClientProvider>
}

export default App
