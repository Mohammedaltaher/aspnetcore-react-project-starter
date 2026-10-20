import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { api } from '../api/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

const schema = z.object({ email: z.email(), password: z.string().min(1) })
type Form = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const cache = useQueryClient()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })
  const submit = handleSubmit(async (values) => {
    setError('')
    try {
      await api.login(values.email, values.password)
      await cache.invalidateQueries({ queryKey: ['auth'] })
      navigate('/customers')
    } catch { setError('Invalid credentials or the API is unavailable.') }
  })
  return <main className="login-page">
    <Card className="login-card">
      <CardHeader><CardTitle className="text-2xl">Sign in</CardTitle><CardDescription>Use the account configured for this project.</CardDescription></CardHeader>
      <CardContent><form onSubmit={submit} className="form-stack">
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="username" {...register('email')} /><FieldError message={errors.email?.message} /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" {...register('password')} /><FieldError message={errors.password?.message} /></div>
        {error && <p role="alert" className="error">{error}</p>}
        <Button disabled={isSubmitting} type="submit">{isSubmitting ? 'Signing in…' : 'Sign in'}</Button>
      </form></CardContent>
    </Card>
  </main>
}

export function FieldError({ message }: { message?: string }) {
  return message ? <p role="alert" className="error">{message}</p> : null
}
