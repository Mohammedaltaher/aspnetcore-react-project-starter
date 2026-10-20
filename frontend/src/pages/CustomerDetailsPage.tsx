import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { FeedbackBanner, LoadingState, PageHeading } from '../components/patterns'
import { buttonVariants } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function CustomerDetailsPage() {
  const { id } = useParams()
  const query = useQuery({ queryKey: ['customer', id], queryFn: () => api.customer(id!), enabled: !!id })
  return <main className="page narrow-page">
    <Link className="back-link" to="/customers">← Back to customers</Link>
    {query.isPending && <LoadingState label="Loading customer…" />}
    {query.isError && <FeedbackBanner tone="error">Could not load customer.</FeedbackBanner>}
    {query.data && <><PageHeading eyebrow="CUSTOMERS / DETAILS" title={query.data.name} description="Customer profile and account information." /><Card className="form-card"><CardHeader><CardTitle>Customer information</CardTitle></CardHeader><CardContent className="details">
      <div><span>Email</span><strong>{query.data.email}</strong></div>
      <div><span>Created</span><strong>{new Date(query.data.createdAtUtc).toLocaleString()}</strong></div>
      <Link className={buttonVariants()} to={`/customers/${id}/edit`}>Edit customer</Link>
    </CardContent></Card></>}
  </main>
}
