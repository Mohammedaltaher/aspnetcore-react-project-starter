import { CalendarDays, LayoutDashboard, LogIn, Menu, PanelsTopLeft, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LogoutButton } from '../auth'

const currentMonth = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date())

export function AppShell({ children, email, preview = false, section = 'Customers' }: {
  children: ReactNode; email?: string; preview?: boolean; section?: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const navItem = ({ isActive }: { isActive: boolean }) => `side-link${isActive ? ' active' : ''}`
  const closeMenu = () => setMenuOpen(false)

  return <div className={`app-shell${collapsed ? ' app-shell-collapsed' : ''}`}>
    <aside id="primary-navigation" className={`sidebar${menuOpen ? ' sidebar-open' : ''}`}>
      <Link className="sidebar-brand" to="/design-system" onClick={closeMenu} aria-label="Starter dashboard">
        <span className="brand-mark"><LayoutDashboard size={20} strokeWidth={2.2} /></span><span className="brand-name">starter<span className="brand-period">.</span></span>
      </Link>
      <nav aria-label="Primary navigation" className="side-nav">
        <NavLink to="/design-system" className={navItem} onClick={closeMenu}><LayoutDashboard size={19} /><span>Dashboard</span></NavLink>
        <NavLink to="/customers" className={navItem} onClick={closeMenu}><UsersRound size={19} /><span>Customers</span></NavLink>
        <NavLink to="/components" className={navItem} onClick={closeMenu}><PanelsTopLeft size={19} /><span>Components</span></NavLink>
      </nav>
      <div className="sidebar-footer"><p className="sidebar-footer-label">PROJECT STARTER</p><p>Reusable patterns for your next application.</p></div>
    </aside>
    {menuOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={closeMenu} />}
    <div className="app-content">
      <header className="app-header">
        <div className="header-left">
          <button className="menu-toggle desktop-menu-toggle" type="button" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded={!collapsed}><Menu size={20} /></button>
          <button className="menu-toggle mobile-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded={menuOpen}><Menu size={20} /></button>
          <span className="header-context">Workspace <span>/</span> {section}</span>
        </div>
        <div className="header-actions">
          <span className="date-chip"><CalendarDays size={17} />{currentMonth}</span>
          {preview ? <Link className="header-signin" to="/login"><LogIn size={16} /> Sign in</Link> : <><span className="user-avatar" aria-hidden="true">{email?.charAt(0).toUpperCase() || 'U'}</span><span className="header-email">{email}</span><LogoutButton /></>}
        </div>
      </header>
      <div className="app-body">{children}</div>
    </div>
  </div>
}
