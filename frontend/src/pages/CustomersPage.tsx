import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Customer } from '../api/client'
import { useAuth } from '../auth'
import { Button, buttonVariants } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

export function CustomersPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [message, setMessage] = useState('')
  const auth = useAuth()
  const cache = useQueryClient()
  const query = useQuery({ queryKey: ['customers', search, sort, page], queryFn: () => api.customers({ search, sort, page }), placeholderData: keepPreviousData })
  const deletion = useMutation({ mutationFn: api.deleteCustomer, onSuccess: async () => {
    setMessage('Customer deleted.')
    await cache.invalidateQueries({ queryKey: ['customers'] })
  } })
  const total = Number(query.data?.total ?? 0)
  return <section className="page">
    <div className="page-heading"><div><h1>Customers</h1><p>Example business module connected to PostgreSQL.</p></div><Link className={buttonVariants()} to="/customers/new">Add customer</Link></div>
    <div className="toolbar"><Input aria-label="Search customers" placeholder="Search name or email" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
      <select aria-label="Sort customers" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
        <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="name">Name A–Z</option><option value="-name">Name Z–A</option><option value="email">Email A–Z</option>
      </select>
    </div>
    {message && <p role="status" className="success">{message}</p>}
    {deletion.isError && <p role="alert" className="error">{deletion.error.message}</p>}
    {query.isPending && <p>Loading customers…</p>}
    {query.isError && <p role="alert" className="error">Could not load customers. <Button variant="link" onClick={() => query.refetch()}>Try again</Button></p>}
    {query.isSuccess && <>
      <div className="table-wrap"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>{query.data.items.map((customer: Customer) => <TableRow key={customer.id}>
          <TableCell className="font-medium"><Link to={`/customers/${customer.id}`}>{customer.name}</Link></TableCell>
          <TableCell>{customer.email}</TableCell><TableCell>{new Date(customer.createdAtUtc).toLocaleDateString()}</TableCell>
          <TableCell className="actions"><Link className={buttonVariants({ variant: 'outline', size: 'sm' })} to={`/customers/${customer.id}/edit`}>Edit</Link>
            {auth.data?.isAdmin && <Button variant="destructive" size="sm" disabled={deletion.isPending} onClick={() => {
              if (window.confirm(`Delete ${customer.name}?`)) deletion.mutate(customer.id)
            }}>Delete</Button>}</TableCell>
        </TableRow>)}</TableBody></Table></div>
      {query.data.items.length === 0 && <p className="empty">No customers found.</p>}
      <div className="pagination"><span>{total} customers · page {page}</span><div className="actions"><Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button><Button variant="outline" disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>Next</Button></div></div>
    </>}
  </section>
}
