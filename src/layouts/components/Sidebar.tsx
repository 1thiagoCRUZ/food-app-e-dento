import { LayoutDashboard, ShoppingBag, Bike, Package, Ticket, Settings, ChevronRight } from 'lucide-react'
import { orders } from '../../data/mock'

import { useAuth } from '../../contexts/AuthContext'

interface SidebarProps {
  collapsed?: boolean
  activePath?: string
  onNavigate?: (path: string) => void
}

export function Sidebar({ collapsed = false, activePath = 'pedidos', onNavigate }: SidebarProps) {
  const { user, restaurant } = useAuth();

  const mainMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: 'dashboard' },
    { icon: ShoppingBag, label: 'Pedidos', path: 'pedidos' },
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
        <div className="sidebar-brand-photo" style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>{restaurant?.name ? restaurant.name.substring(0, 2).toUpperCase() : 'LO'}</span>
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">{restaurant?.name || 'Seu Restaurante'}</div>
          <div className="sidebar-brand-sub flex items-center gap-4">
            Gestão de Loja
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
          <div className="user-avatar">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'JS'}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Usuário'}</div>
            <div className="user-role">{restaurant?.name || 'Administrador'}</div>
          </div>
          <ChevronRight size={16} className="user-chev" color="var(--text-light)" />
        </div>
      </div>
    </aside>
  )
}
