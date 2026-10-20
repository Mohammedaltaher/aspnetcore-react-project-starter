import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Boxes, Layers3, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { api } from '../api/client'
import { FeedbackBanner, FieldError } from '../components/patterns'
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
    <aside className="login-feature"><Link className="login-brand" to="/login"><span className="brand-mark"><Boxes size={20} /></span> starter<span className="brand-period">.</span></Link>
      <div className="login-feature-content"><div className="login-overline">A BETTER STARTING POINT</div><h1>Build the next thing with confidence.</h1><p>A clear, flexible foundation for the tools your team uses every day.</p>
        <div className="login-feature-list"><div><Layers3 size={18} /> Consistent components</div><div><ShieldCheck size={18} /> Secure by default</div></div>
      </div><div className="login-feature-bottom">ASP.NET Core + React starter</div>
    </aside>
    <div className="login-panel"><Card className="login-card">
      <CardHeader><p className="eyebrow">WELCOME BACK</p><CardTitle className="login-title">Sign in</CardTitle><CardDescription>Use the account configured for this project.</CardDescription></CardHeader>
      <CardContent><form onSubmit={submit} className="form-stack">
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="username" {...register('email')} /><FieldError message={errors.email?.message} /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" {...register('password')} /><FieldError message={errors.password?.message} /></div>
        {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
        <Button size="lg" disabled={isSubmitting} type="submit">{isSubmitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></Button>
      </form></CardContent>
    </Card><p className="login-preview-link">Exploring the template? <Link to="/design-system">Preview the UI kit <ArrowRight size={14} /></Link></p></div>
  </main>
}
