import { PanelLeft, Search, Bell, HelpCircle } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar?: () => void
  storeOpen?: boolean
  onToggleStore?: () => void
}

export function Header({ onToggleSidebar, storeOpen = true, onToggleStore }: HeaderProps) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button className="btn-icon" onClick={onToggleSidebar} title="Recolher menu">
          <PanelLeft size={18} />
        </button>
        <div className="search-box">
          <Search size={16} color="var(--text-light)" />
          <input placeholder="Buscar pedido, cliente ou produto…" />
        </div>
      </div>

      <div className="header-right">
        <button
          className={`store-status ${storeOpen ? '' : 'off'}`}
          onClick={onToggleStore}
          title={storeOpen ? 'Clique para fechar a loja' : 'Clique para abrir a loja'}
        >
          <span className="store-status-light" />
          <span className="store-status-text">{storeOpen ? 'Loja aberta' : 'Loja fechada'}</span>
        </button>
        <button className="notification-btn" title="Notificações">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>
        <button className="btn-icon" title="Ajuda">
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  )
}
