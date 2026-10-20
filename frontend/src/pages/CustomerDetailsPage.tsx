import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { buttonVariants } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function CustomerDetailsPage() {
  const { id } = useParams()
  const query = useQuery({ queryKey: ['customer', id], queryFn: () => api.customer(id!), enabled: !!id })
  return <main className="page narrow-page">
    <Link className={buttonVariants({ variant: 'link' })} to="/customers">← Customers</Link>
    {query.isPending && <p>Loading customer…</p>}
    {query.isError && <p role="alert" className="error">Could not load customer.</p>}
    {query.data && <Card><CardHeader><CardTitle>{query.data.name}</CardTitle></CardHeader><CardContent className="details">
      <div><span>Email</span><strong>{query.data.email}</strong></div>
      <div><span>Created</span><strong>{new Date(query.data.createdAtUtc).toLocaleString()}</strong></div>
      <Link className={buttonVariants()} to={`/customers/${id}/edit`}>Edit customer</Link>
    </CardContent></Card>}
  </main>
}
