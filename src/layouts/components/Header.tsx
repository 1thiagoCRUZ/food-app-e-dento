import { ChevronLeft, PanelLeft } from 'lucide-react';

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="btn-icon btn-sidebar-toggle" 
          onClick={toggleSidebar}
        >
          <PanelLeft size={18} />
        </button>
      </div>
    </header>
  );
}