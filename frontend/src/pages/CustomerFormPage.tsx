import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { api, type CustomerInput } from '../api/client'
import { Button, buttonVariants } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { FieldError } from './LoginPage'

const schema = z.object({ name: z.string().trim().min(1, 'Name is required').max(120), email: z.email().max(254) })

export function CustomerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cache = useQueryClient()
  const query = useQuery({ queryKey: ['customer', id], queryFn: () => api.customer(id!), enabled: !!id })
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerInput>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '' } })
  useEffect(() => { if (query.data) reset({ name: query.data.name, email: query.data.email }) }, [query.data, reset])
  const save = useMutation({ mutationFn: (input: CustomerInput) => id ? api.updateCustomer(id, input) : api.createCustomer(input),
    onSuccess: async customer => {
      cache.setQueryData(['customer', customer.id], customer)
      await cache.invalidateQueries({ queryKey: ['customers'] })
      navigate(`/customers/${customer.id}`)
    } })
  if (id && query.isPending) return <main className="page"><p>Loading customer…</p></main>
  if (id && query.isError) return <main className="page"><p role="alert" className="error">Could not load customer.</p><Link to="/customers">Back to customers</Link></main>
  return <main className="page narrow-page">
    <Link className={buttonVariants({ variant: 'link' })} to="/customers">← Customers</Link>
    <Card><CardHeader><CardTitle>{id ? 'Edit customer' : 'New customer'}</CardTitle></CardHeader><CardContent>
      <form className="form-stack" onSubmit={handleSubmit(values => save.mutate(values))}>
        <div><Label htmlFor="name">Name</Label><Input id="name" {...register('name')} /><FieldError message={errors.name?.message} /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register('email')} /><FieldError message={errors.email?.message} /></div>
        {save.isError && <p role="alert" className="error">{save.error.message}</p>}
        <div className="actions"><Button type="submit" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save customer'}</Button><Link className={buttonVariants({ variant: 'outline' })} to="/customers">Cancel</Link></div>
      </form>
    </CardContent></Card>
  </main>
}
