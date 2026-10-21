import { ArrowRight, Bell, ChevronLeft, ChevronRight, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog, EmptyState, FeedbackBanner, LoadingState, PageHeading, StatusBadge } from '../components/patterns'
import { Button, buttonVariants } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

const samples = [
  { name: 'Acme Studio', email: 'hello@acme.studio', status: 'Active', created: 'Oct 18, 2026' },
  { name: 'Northstar Labs', email: 'team@northstar.io', status: 'Pending', created: 'Oct 16, 2026' },
  { name: 'Maple & Co.', email: 'contact@maple.co', status: 'Active', created: 'Oct 12, 2026' },
]

export function DesignSystemPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(true)
  return <main className="page design-page">
    <PageHeading eyebrow="DESIGN SYSTEM / V1" title="Interface kit" description="A living preview of the patterns used across this starter. Replace the sample content and brand tokens when you begin a product."
      action={<Link className={buttonVariants({ variant: 'outline', size: 'lg' })} to="/customers">Open sample app <ArrowRight size={16} /></Link>} />

    <section className="design-section" aria-labelledby="foundation-title">
      <div className="section-heading"><div><p className="eyebrow">01 / FOUNDATION</p><h2 id="foundation-title">A calm canvas for busy work</h2></div><p>One spacing rhythm, clear type hierarchy, and colors that communicate purpose.</p></div>
      <div className="foundation-grid">
        <Card><CardHeader><CardTitle>Color tokens</CardTitle></CardHeader><CardContent><div className="swatches">
          <div><span className="swatch swatch-primary" /><strong>Primary</strong><small>#3165F5</small></div>
          <div><span className="swatch swatch-ink" /><strong>Ink</strong><small>#202329</small></div>
          <div><span className="swatch swatch-canvas" /><strong>Canvas</strong><small>#FAFBFC</small></div>
          <div><span className="swatch swatch-success" /><strong>Success</strong><small>#16805D</small></div>
          <div><span className="swatch swatch-warning" /><strong>Warning</strong><small>#AF6B18</small></div>
        </div></CardContent></Card>
        <Card><CardHeader><CardTitle>Typography</CardTitle></CardHeader><CardContent><div className="type-sample"><span className="eyebrow">PAGE TITLE / GEIST</span><strong>Customers at a glance</strong><p>Readable defaults keep data, actions, and context easy to scan.</p><small>LABEL · TABLE · HELPER TEXT</small></div></CardContent></Card>
      </div>
    </section>

    <section className="design-section" aria-labelledby="controls-title">
      <div className="section-heading"><div><p className="eyebrow">02 / CONTROLS</p><h2 id="controls-title">Actions and inputs</h2></div><p>Primary actions are prominent. Secondary and destructive actions stay distinct.</p></div>
      <div className="showcase-grid">
        <Card><CardHeader><CardTitle>Buttons</CardTitle></CardHeader><CardContent><div className="button-showcase">
          <Button size="lg"><Plus size={16} /> Create customer</Button><Button variant="outline" size="lg">Secondary</Button><Button variant="ghost" size="lg">Ghost</Button><Button variant="destructive" size="lg"><Trash2 size={16} /> Delete</Button><Button size="lg" disabled>Disabled</Button>
        </div><p className="component-note">Use one primary action per area. Keep destructive actions behind confirmation.</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Form fields</CardTitle></CardHeader><CardContent><div className="form-stack">
          <div><Label htmlFor="demo-name">Customer name</Label><Input id="demo-name" placeholder="e.g. Northstar Labs" /></div>
          <div><Label htmlFor="demo-search">Search</Label><div className="search-field"><Search size={17} aria-hidden="true" /><Input id="demo-search" placeholder="Search name or email" /></div></div>
          <div><Label htmlFor="demo-sort">Sort by</Label><select className="select-field" id="demo-sort" defaultValue="newest"><option value="newest">Newest first</option><option value="name">Name A–Z</option></select></div>
          <p className="field-help">Helper text explains the rule before an error occurs.</p>
        </div></CardContent></Card>
      </div>
    </section>

    <section className="design-section" aria-labelledby="feedback-title">
      <div className="section-heading"><div><p className="eyebrow">03 / FEEDBACK</p><h2 id="feedback-title">Every state has a place</h2></div><p>Show what happened, what is happening, and what the user can do next.</p></div>
      <div className="showcase-grid">
        <Card><CardHeader><CardTitle>Messages and statuses</CardTitle></CardHeader><CardContent className="stacked-showcase">
          {showSuccess && <FeedbackBanner tone="success" onDismiss={() => setShowSuccess(false)}>Customer saved successfully.</FeedbackBanner>}
          <FeedbackBanner tone="error">Could not save the customer. Check the form and try again.</FeedbackBanner>
          <div className="badge-row"><StatusBadge tone="success">Active</StatusBadge><StatusBadge tone="warning">Pending</StatusBadge><StatusBadge tone="info">Draft</StatusBadge><StatusBadge>Archived</StatusBadge></div>
          <LoadingState label="Loading customers…" />
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Empty state</CardTitle></CardHeader><CardContent><EmptyState title="No customers yet" description="Add your first customer to see records here." action={<Button><Plus size={16} /> Add customer</Button>} /></CardContent></Card>
      </div>
    </section>

    <section className="design-section" aria-labelledby="data-title">
      <div className="section-heading"><div><p className="eyebrow">04 / DATA</p><h2 id="data-title">A clear list pattern</h2></div><p>Search, sort, scan, and act without losing the page context.</p></div>
      <Card className="data-card"><div className="data-card-top"><div><h3>Customers</h3><p>3 customers in this preview</p></div><Button><Plus size={16} /> Add customer</Button></div>
        <div className="data-toolbar"><div className="search-field"><Search size={17} aria-hidden="true" /><Input aria-label="Search mock customers" placeholder="Search customers" /></div><select className="select-field" aria-label="Sort mock customers" defaultValue="newest"><option value="newest">Newest first</option><option value="name">Name A–Z</option></select></div>
        <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Added</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
          <TableBody>{samples.map(item => <TableRow key={item.email}><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.email}</TableCell><TableCell><StatusBadge tone={item.status === 'Active' ? 'success' : 'warning'}>{item.status}</StatusBadge></TableCell><TableCell>{item.created}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm">View <ArrowRight size={14} /></Button></TableCell></TableRow>)}</TableBody></Table>
        <div className="data-footer"><span>Showing 1–3 of 3</span><div className="actions"><Button variant="outline" size="sm" disabled><ChevronLeft size={15} /> Previous</Button><Button variant="outline" size="sm" disabled>Next <ChevronRight size={15} /></Button></div></div>
      </Card>
    </section>

    <section className="design-section" aria-labelledby="patterns-title">
      <div className="section-heading"><div><p className="eyebrow">05 / PATTERNS</p><h2 id="patterns-title">Common page pieces</h2></div><p>Use the same card, detail, and confirmation patterns across modules.</p></div>
      <div className="showcase-grid">
        <Card><CardHeader><CardTitle>Detail panel</CardTitle></CardHeader><CardContent><div className="detail-list"><div><span>Customer</span><strong>Acme Studio</strong></div><div><span>Email</span><strong>hello@acme.studio</strong></div><div><span>Status</span><StatusBadge tone="success">Active</StatusBadge></div></div><Button variant="outline" size="lg">Edit details <ArrowRight size={16} /></Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Confirmation</CardTitle></CardHeader><CardContent><div className="confirmation-preview"><div className="dialog-symbol"><Trash2 size={21} /></div><h3>Delete with confidence</h3><p>Show the exact record and make the destructive choice explicit.</p><Button variant="destructive" onClick={() => setDialogOpen(true)}>Preview confirmation</Button></div></CardContent></Card>
      </div>
    </section>
    <div className="design-footnote"><Bell size={16} /><span>This gallery contains sample data only. The Customers module remains connected to the API.</span></div>
    <ConfirmDialog open={dialogOpen} title="Delete Acme Studio?" description="This action removes Acme Studio from your customer list. This is a design preview; no data will be deleted." onCancel={() => setDialogOpen(false)} onConfirm={() => setDialogOpen(false)} />
  </main>
}
