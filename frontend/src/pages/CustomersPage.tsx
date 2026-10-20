import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Customer } from '../api/client'
import { useAuth } from '../auth'
import { ConfirmDialog, EmptyState, FeedbackBanner, LoadingState, PageHeading } from '../components/patterns'
import { Button, buttonVariants } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

export function CustomersPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [message, setMessage] = useState('')
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const auth = useAuth()
  const cache = useQueryClient()
  const query = useQuery({ queryKey: ['customers', search, sort, page], queryFn: () => api.customers({ search, sort, page }), placeholderData: keepPreviousData })
  const deletion = useMutation({ mutationFn: api.deleteCustomer, onSuccess: async () => {
    setCustomerToDelete(null)
    setMessage('Customer deleted successfully.')
    await cache.invalidateQueries({ queryKey: ['customers'] })
  } })
  const total = Number(query.data?.total ?? 0)
  return <main className="page">
    <PageHeading eyebrow="WORKSPACE / CUSTOMERS" title="Customers" description="Manage the people and organizations in your workspace."
      action={<Link className={buttonVariants({ size: 'lg' })} to="/customers/new"><Plus size={16} /> Add customer</Link>} />
    <div className="toolbar"><div className="search-field"><Search size={17} aria-hidden="true" /><Input aria-label="Search customers" placeholder="Search name or email" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div>
      <select className="select-field" aria-label="Sort customers" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
        <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option><option value="-name">Name Z–A</option><option value="email">Email A–Z</option>
      </select>
    </div>
    {message && <div className="list-feedback"><FeedbackBanner tone="success" onDismiss={() => setMessage('')}>{message}</FeedbackBanner></div>}
    {deletion.isError && <div className="list-feedback"><FeedbackBanner tone="error">{deletion.error.message}</FeedbackBanner></div>}
    {query.isPending && <LoadingState label="Loading customers…" />}
    {query.isError && <FeedbackBanner tone="error">Could not load customers. <Button variant="link" onClick={() => query.refetch()}>Try again</Button></FeedbackBanner>}
    {query.isSuccess && (query.data.items.length === 0 ? <div className="table-wrap"><EmptyState title={search ? 'No matching customers' : 'No customers yet'} description={search ? 'Try a different name or email address.' : 'Add your first customer to get started.'} action={!search && <Link className={buttonVariants()} to="/customers/new"><Plus size={16} /> Add customer</Link>} /></div> : <>
      <div className="table-wrap"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>{query.data.items.map(customer => <TableRow key={customer.id}>
          <TableCell><Link to={`/customers/${customer.id}`}>{customer.name}</Link></TableCell>
          <TableCell>{customer.email}</TableCell><TableCell>{new Date(customer.createdAtUtc).toLocaleDateString()}</TableCell>
          <TableCell><div className="actions"><Link className={buttonVariants({ variant: 'outline', size: 'sm' })} to={`/customers/${customer.id}/edit`}>Edit</Link>
            {auth.data?.isAdmin && <Button variant="destructive" size="sm" disabled={deletion.isPending} onClick={() => setCustomerToDelete(customer)} aria-label={`Delete ${customer.name}`}>Delete</Button>}</div></TableCell>
        </TableRow>)}</TableBody></Table></div>
      <div className="pagination"><span>{total} customers · Page {page}</span><div className="actions"><Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={15} /> Previous</Button><Button variant="outline" disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>Next <ChevronRight size={15} /></Button></div></div>
    </>)}
    <ConfirmDialog open={customerToDelete !== null} title={`Delete ${customerToDelete?.name ?? 'customer'}?`} description="This customer will be removed from your workspace. This action cannot be undone." pending={deletion.isPending} onCancel={() => setCustomerToDelete(null)} onConfirm={() => { if (customerToDelete) deletion.mutate(customerToDelete.id) }} />
  </main>
}
