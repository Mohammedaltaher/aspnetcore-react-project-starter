import { Boxes, LayoutGrid, LogIn, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LogoutButton } from '../auth'
import { StatusBadge } from './patterns'

export function AppShell({ children, email, preview = false }: {
  children: ReactNode; email?: string; preview?: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItem = ({ isActive }: { isActive: boolean }) => `side-link${isActive ? ' active' : ''}`
  return <div className="app-shell">
    <aside className={`sidebar${menuOpen ? ' sidebar-open' : ''}`}>
      <Link className="sidebar-brand" to="/customers" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark"><Boxes size={20} strokeWidth={2.3} /></span><span>starter<span className="brand-period">.</span><small>PROJECT FOUNDATION</small></span>
      </Link>
      <div className="sidebar-section-label">WORKSPACE</div>
      <nav aria-label="Primary navigation" className="side-nav">
        <NavLink to="/customers" className={navItem} onClick={() => setMenuOpen(false)}><LayoutGrid size={18} /> Customers</NavLink>
        <NavLink to="/design-system" className={navItem} onClick={() => setMenuOpen(false)}><Boxes size={18} /> UI kit <span className="nav-pill">NEW</span></NavLink>
      </nav>
      <div className="sidebar-footer"><div className="sidebar-footer-label">STARTER TEMPLATE</div><p>Build your next module on a consistent foundation.</p></div>
    </aside>
    {menuOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <div className="app-content">
      <header className="app-header">
        <div className="header-left"><button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <span className="header-context">Workspace <span>/</span> {preview ? 'UI kit' : 'Customers'}</span></div>
        <div className="header-actions">{preview ? <><StatusBadge tone="info">Preview</StatusBadge><Link className="header-signin" to="/login"><LogIn size={16} /> Sign in</Link></> : <><span className="user-avatar" aria-hidden="true">{email?.charAt(0).toUpperCase() || 'U'}</span><span className="header-email">{email}</span><LogoutButton /></>}</div>
      </header>
      <div className="app-body">{children}</div>
    </div>
  </div>
}
