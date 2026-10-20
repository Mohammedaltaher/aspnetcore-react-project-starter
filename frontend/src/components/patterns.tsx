import { AlertCircle, CheckCircle2, Inbox, LoaderCircle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Button } from './ui/button'

export function PageHeading({ eyebrow, title, description, action }: {
  eyebrow?: string; title: string; description?: string; action?: ReactNode
}) {
  return <header className="page-heading">
    <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>
    {action && <div className="page-heading-action">{action}</div>}
  </header>
}

export function StatusBadge({ children, tone = 'neutral' }: {
  children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'info'
}) {
  return <span className={`status-badge status-${tone}`}><span className="status-dot" />{children}</span>
}

export function FeedbackBanner({ tone, children, onDismiss }: {
  tone: 'success' | 'error'; children: ReactNode; onDismiss?: () => void
}) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle
  return <div className={`feedback-banner feedback-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
    <Icon size={18} aria-hidden="true" /><div>{children}</div>
    {onDismiss && <button className="icon-button" type="button" onClick={onDismiss} aria-label="Dismiss message"><X size={16} /></button>}
  </div>
}

export function EmptyState({ title, description, action }: {
  title: string; description: string; action?: ReactNode
}) {
  return <div className="empty-state"><div className="empty-icon"><Inbox size={24} aria-hidden="true" /></div>
    <h2>{title}</h2><p>{description}</p>{action && <div className="empty-action">{action}</div>}
  </div>
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return <div className="loading-state" role="status"><LoaderCircle className="spin" size={20} aria-hidden="true" />{label}</div>
}

export function FieldError({ message }: { message?: string }) {
  return message ? <p role="alert" className="error">{message}</p> : null
}

export function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', pending = false, onCancel, onConfirm }: {
  open: boolean; title: string; description: string; confirmLabel?: string; pending?: boolean;
  onCancel: () => void; onConfirm: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal()
    if (!open && dialog.current?.open) dialog.current.close()
  }, [open])
  return <dialog ref={dialog} className="confirm-dialog" onCancel={onCancel}>
    <div className="dialog-symbol"><AlertCircle size={22} aria-hidden="true" /></div>
    <h2>{title}</h2><p>{description}</p>
    <div className="dialog-actions"><Button variant="outline" onClick={onCancel} disabled={pending}>Cancel</Button>
      <Button variant="destructive" onClick={onConfirm} disabled={pending}>{pending ? 'Deleting…' : confirmLabel}</Button>
    </div>
  </dialog>
}
