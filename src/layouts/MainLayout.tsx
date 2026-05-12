import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export default function MainLayout({ children, activePath = 'pedidos', onNavigate }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="app-container">
      <Sidebar 
        collapsed={isSidebarCollapsed} 
        activePath={activePath} 
        onNavigate={onNavigate} 
      />
      
      <div className="main-content">
        <Header toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        <main className="page-content">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}