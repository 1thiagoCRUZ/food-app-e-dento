import { LayoutDashboard, ShoppingBag, Package, Ticket, Store } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: 'dashboard' },
  { icon: ShoppingBag, label: 'Pedidos', path: 'pedidos' },
  { icon: Package, label: 'Produtos', path: 'produtos' },
  { icon: Ticket, label: 'Cupons', path: 'cupons' },
];

interface SidebarProps {
  collapsed?: boolean;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export function Sidebar({ collapsed = false, activePath = 'pedidos', onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Store size={24} color="var(--primary)" />
        <div className="sidebar-logo">
          <span>Painel do Lojista</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`nav-item ${activePath === item.path ? 'active' : ''}`}
            onClick={() => onNavigate?.(item.path)}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} strokeWidth={activePath === item.path ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}