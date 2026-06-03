import { LayoutDashboard, ShoppingBag, Bike, Package, Ticket, Settings, ChevronRight, Star } from 'lucide-react'
import { orders, store } from '../../data/mock'

interface SidebarProps {
  collapsed?: boolean
  activePath?: string
  onNavigate?: (path: string) => void
}

export function Sidebar({ collapsed = false, activePath = 'pedidos', onNavigate }: SidebarProps) {
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'preparing').length

  const mainMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: 'dashboard' },
    { icon: ShoppingBag, label: 'Pedidos', path: 'pedidos', badge: pendingOrders },
    { icon: Bike, label: 'Entregadores', path: 'entregadores' },
  ]

  const catalogMenu = [
    { icon: Package, label: 'Produtos', path: 'produtos' },
    { icon: Ticket, label: 'Cupons', path: 'cupons' },
  ]

  const bottomMenu = [
    { icon: Settings, label: 'Configurações', path: 'configuracoes' },
  ]

  const renderItem = (item: any) => (
    <button
      key={item.path}
      className={`nav-item ${activePath === item.path ? 'active' : ''}`}
      onClick={() => onNavigate?.(item.path)}
      title={collapsed ? item.label : undefined}
    >
      <item.icon size={18} strokeWidth={activePath === item.path ? 2.5 : 2} />
      <span>{item.label}</span>
      {item.badge ? <span className="nav-item-badge">{item.badge}</span> : null}
    </button>
  )

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src={store.photo} alt={store.name} className="sidebar-brand-photo" />
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">{store.name}</div>
          <div className="sidebar-brand-sub flex items-center gap-4">
            <Star size={10} fill="currentColor" /> {store.rating} · {store.tagline}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">Operação</div>
        {mainMenu.map(renderItem)}

        <div className="sidebar-section" style={{ marginTop: 12 }}>Catálogo</div>
        {catalogMenu.map(renderItem)}

        <div style={{ marginTop: 'auto' }}>
          {bottomMenu.map(renderItem)}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">JS</div>
          <div className="user-info">
            <div className="user-name">João Silva</div>
            <div className="user-role">Pizzaria Roma</div>
          </div>
          <ChevronRight size={16} className="user-chev" color="var(--text-light)" />
        </div>
      </div>
    </aside>
  )
}
