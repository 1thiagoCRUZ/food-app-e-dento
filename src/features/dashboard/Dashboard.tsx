import { useState } from 'react';
import { ShoppingBag, DollarSign, TrendingUp, ToggleRight, ToggleLeft } from 'lucide-react';

export function Dashboard() {
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="product-desc">Visão geral da sua loja</p>
        </div>
        <button 
          onClick={() => setIsStoreOpen(!isStoreOpen)}
          style={{ 
            backgroundColor: isStoreOpen ? 'var(--success)' : 'var(--border)', 
            color: isStoreOpen ? 'white' : 'var(--text-main)',
            fontSize: 14,
            padding: '8px 16px',
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          {isStoreOpen ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          {isStoreOpen ? 'Loja Aberta' : 'Loja Fechada'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        {/* Card 1 */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius)', padding: 24, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 500 }}>Pedidos Hoje</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>47</div>
          <div style={{ color: 'var(--success)', fontSize: 12, fontWeight: 500 }}>+12% vs ontem</div>
        </div>

        {/* Card 2 */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius)', padding: 24, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 500 }}>Faturamento</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>R$3.842</div>
          <div style={{ color: 'var(--success)', fontSize: 12, fontWeight: 500 }}>+8% vs ontem</div>
        </div>

        {/* Card 3 */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius)', padding: 24, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 500 }}>Ticket Médio</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>R$81,74</div>
          <div style={{ color: 'var(--success)', fontSize: 12, fontWeight: 500 }}>+3% vs ontem</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius)', padding: 24, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 24 }}>Últimos Pedidos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '16px 24px', border: '1px solid var(--border)', borderRadius: 9999, fontSize: 13, color: 'var(--text-main)' }}>
            <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>ORD-005</span> • Fernanda Costa • R$68,70 • <span style={{ color: 'var(--success)', fontWeight: 500 }}>Pronto</span>
          </div>
          <div style={{ padding: '16px 24px', border: '1px solid var(--border)', borderRadius: 9999, fontSize: 13, color: 'var(--text-main)' }}>
            <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>ORD-004</span> • João Lima • R$46,90 • <span style={{ color: '#3B82F6', fontWeight: 500 }}>Em preparo</span>
          </div>
          <div style={{ padding: '16px 24px', border: '1px solid var(--border)', borderRadius: 9999, fontSize: 13, color: 'var(--text-main)' }}>
            <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>ORD-003</span> • Maria Santos • R$69,90 • <span style={{ color: '#3B82F6', fontWeight: 500 }}>Em preparo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
