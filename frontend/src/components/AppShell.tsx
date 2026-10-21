import { Ambulance, Bell, CalendarDays, ChevronDown, ClipboardList, FileText, LayoutDashboard, LogIn, LogOut, Menu, PanelsTopLeft, Search, Settings, SquareUserRound, Stethoscope, UsersRound, Wallet, Building2, UserRound } from 'lucide-react'
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const referencePreview = preview && section === 'Dashboard'
  const navItem = ({ isActive }: { isActive: boolean }) => `side-link${isActive ? ' active' : ''}`
  const closeMenu = () => setMenuOpen(false)

  return <div className={`app-shell${collapsed ? ' app-shell-collapsed' : ''}${referencePreview ? ' reference-shell' : ''}`}>
    <aside id="primary-navigation" className={`sidebar${menuOpen ? ' sidebar-open' : ''}`}>
      {referencePreview ? <Link className="sidebar-brand" to="/design-system" onClick={closeMenu} aria-label="ICarePro dashboard">ICarePro</Link> : <Link className="sidebar-brand" to="/design-system" onClick={closeMenu} aria-label="Starter dashboard">
        <span className="brand-mark"><LayoutDashboard size={20} strokeWidth={2.2} /></span><span className="brand-name">starter<span className="brand-period">.</span></span>
      </Link>}
      {referencePreview ? <>
        <nav aria-label="Dashboard navigation" className="side-nav reference-nav">
          <NavLink to="/design-system" className={navItem} onClick={closeMenu}><LayoutDashboard size={22} fill="currentColor" strokeWidth={2.5} /><span>Dashboard</span></NavLink>
          <span className="side-link"><ClipboardList size={22} /><span>Appointments</span><b>+</b></span>
          <span className="side-link"><Stethoscope size={22} /><span>Doctors</span><b>+</b></span>
          <span className="side-link"><UserRound size={22} /><span>Staff</span></span>
          <span className="side-link"><SquareUserRound size={22} /><span>Patients</span><b>+</b></span>
          <span className="side-link"><Building2 size={22} /><span>Room Allotment</span><b>+</b></span>
          <span className="side-link"><Wallet size={22} /><span>Billing</span></span>
          <span className="side-link"><FileText size={22} /><span>Records</span></span>
          <span className="side-link"><Ambulance size={22} /><span>Ambulance</span></span>
        </nav>
        <div className="reference-nav-bottom"><span className="side-link"><Settings size={22} /><span>Setting</span></span><Link className="side-link" to="/login"><LogOut size={22} /><span>Logout</span></Link></div>
      </> : <><nav aria-label="Primary navigation" className="side-nav">
        <NavLink to="/design-system" className={navItem} onClick={closeMenu}><LayoutDashboard size={19} /><span>Dashboard</span></NavLink>
        <NavLink to="/customers" className={navItem} onClick={closeMenu}><UsersRound size={19} /><span>Customers</span></NavLink>
        <NavLink to="/components" className={navItem} onClick={closeMenu}><PanelsTopLeft size={19} /><span>Components</span></NavLink>
      </nav>
      <div className="sidebar-footer"><p className="sidebar-footer-label">PROJECT STARTER</p><p>Reusable patterns for your next application.</p></div></>}
    </aside>
    {menuOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={closeMenu} />}
    <div className="app-content">
      <header className="app-header">
        <div className="header-left">
          <button className="menu-toggle desktop-menu-toggle" type="button" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded={!collapsed}><Menu size={20} /></button>
          <button className="menu-toggle mobile-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded={menuOpen}><Menu size={20} /></button>
          {!referencePreview && <span className="header-context">Workspace <span>/</span> {section}</span>}
        </div>
        {referencePreview ? <div className="header-actions reference-header-actions">
          <label className="reference-date"><CalendarDays size={23} /><select aria-label="Dashboard month" defaultValue="Apr–2023"><option>Apr–2023</option><option>Mar–2023</option><option>May–2023</option></select><ChevronDown size={18} /></label>
          <div className="reference-header-tool-wrap"><button className="reference-header-tool" aria-label="Search dashboard" aria-expanded={searchOpen} type="button" onClick={() => setSearchOpen(!searchOpen)}><Search size={26} /></button>{searchOpen && <input className="reference-search" autoFocus aria-label="Search preview" placeholder="Search preview…" />}</div>
          <div className="reference-header-tool-wrap"><button className="reference-header-tool notification-tool" aria-label="Notifications" aria-expanded={notificationsOpen} type="button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={25} /><i /></button>{notificationsOpen && <div className="reference-notification">No new notifications in this preview.</div>}</div>
          <div className="reference-profile"><span className="reference-avatar avatar-noah" aria-hidden="true" /><span><strong>Noah Arthur</strong><small>Admin</small></span></div>
        </div> : <div className="header-actions">
          <span className="date-chip"><CalendarDays size={17} />{currentMonth}</span>
          {preview ? <Link className="header-signin" to="/login"><LogIn size={16} /> Sign in</Link> : <><span className="user-avatar" aria-hidden="true">{email?.charAt(0).toUpperCase() || 'U'}</span><span className="header-email">{email}</span><LogoutButton /></>}
        </div>}
      </header>
      <div className="app-body">{children}</div>
    </div>
  </div>
}
