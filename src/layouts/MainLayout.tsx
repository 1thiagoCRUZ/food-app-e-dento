import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

interface MainLayoutProps {
  children: React.ReactNode
  activePath?: string
  onNavigate?: (path: string) => void
}

export default function MainLayout({ children, activePath = 'pedidos', onNavigate }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [storeOpen, setStoreOpen] = useState(true)

  return (
    <div className="app-container">
      <Sidebar collapsed={collapsed} activePath={activePath} onNavigate={onNavigate} />
      <div className="main-content">
        <Header
          onToggleSidebar={() => setCollapsed(!collapsed)}
          storeOpen={storeOpen}
          onToggleStore={() => setStoreOpen(!storeOpen)}
        />
        <main className="page-content">
          <div className="page-inner">{children}</div>
        </main>
      </div>
    </div>
  )
}
