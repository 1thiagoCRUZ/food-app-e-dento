import { ShoppingBag, DollarSign, TrendingUp, Clock, ArrowUp, ArrowDown, ChevronRight, Bike } from 'lucide-react'
import { orders, drivers, hourlyOrders, topProducts } from '../../data/mock'
import { formatBRL } from '../../lib/format'

interface DashboardProps {
  onNavigate?: (path: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const todayOrders = 47
  const todayRevenue = 3842
  const avgTicket = 81.74
  const avgPrepTime = 28

  const newCount = orders.filter(o => o.status === 'new').length
  const preparingCount = orders.filter(o => o.status === 'preparing').length
  const readyCount = orders.filter(o => o.status === 'ready').length
  const shippingCount = orders.filter(o => o.status === 'shipping').length

  const availableDrivers = drivers.filter(d => d.status === 'available').length
  const busyDrivers = drivers.filter(d => d.status === 'busy').length

  const maxHourly = Math.max(...hourlyOrders.map(h => h.count))
  const maxTopProduct = Math.max(...topProducts.map(p => p.count))

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumo da operação · Hoje, 03 jun 2026</p>
        </div>
        <div className="flex gap-8 items-center">
          <button className="btn btn-outline">
            <Clock size={16} /> Últimas 24h
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate?.('pedidos')}>
            <ShoppingBag size={16} /> Ver pedidos
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Pedidos hoje</span>
            <div className="stat-icon"><ShoppingBag size={18} /></div>
          </div>
          <div className="stat-value">{todayOrders}</div>
          <div className="stat-delta up"><ArrowUp size={12} /> +12% vs ontem</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Faturamento</span>
            <div className="stat-icon"><DollarSign size={18} /></div>
          </div>
          <div className="stat-value">R$ {todayRevenue.toLocaleString('pt-BR')}</div>
          <div className="stat-delta up"><ArrowUp size={12} /> +8% vs ontem</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Ticket médio</span>
            <div className="stat-icon"><TrendingUp size={18} /></div>
          </div>
          <div className="stat-value">{formatBRL(avgTicket)}</div>
          <div className="stat-delta up"><ArrowUp size={12} /> +3% vs ontem</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Tempo médio de preparo</span>
            <div className="stat-icon"><Clock size={18} /></div>
          </div>
          <div className="stat-value">{avgPrepTime} min</div>
          <div className="stat-delta down"><ArrowDown size={12} /> -4 min vs ontem</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card card-pad-lg">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="text-lg fw-700 text-dark">Pedidos por hora</div>
              <div className="text-sm text-muted">Distribuição de hoje</div>
            </div>
            <span className="pill pill-neutral">Pico às 12h e 19h</span>
          </div>
          <div className="mini-bar-chart">
            {hourlyOrders.map(h => (
              <div
                key={h.hour}
                className={`mini-bar ${h.peak ? 'peak' : ''}`}
                style={{ height: `${(h.count / maxHourly) * 100}%` }}
                title={`${h.hour}: ${h.count} pedidos`}
              />
            ))}
          </div>
          <div className="mini-bar-labels">
            {hourlyOrders.map(h => (
              <div key={h.hour} className="mini-bar-label">{h.hour}</div>
            ))}
          </div>
        </div>

        <div className="card card-pad-lg">
          <div className="text-lg fw-700 text-dark mb-12">Status dos pedidos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <StatusLine label="Novos" count={newCount} total={orders.length} color="var(--primary)" />
            <StatusLine label="Em preparo" count={preparingCount} total={orders.length} color="var(--info)" />
            <StatusLine label="Prontos" count={readyCount} total={orders.length} color="var(--warning)" />
            <StatusLine label="Em entrega" count={shippingCount} total={orders.length} color="var(--success)" />
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
            <div className="flex justify-between text-sm text-muted mb-12">
              <span>Entregadores</span>
            </div>
            <div className="flex gap-8">
              <div className="pill pill-success"><Bike size={12} /> {availableDrivers} disponíveis</div>
              <div className="pill pill-warning"><Bike size={12} /> {busyDrivers} em rota</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card card-pad-lg">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="text-lg fw-700 text-dark">Pedidos recentes</div>
              <div className="text-sm text-muted">Últimos do dia</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate?.('pedidos')}>
              Ver todos <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {orders.slice(0, 5).map(o => (
              <div
                key={o.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}
              >
                <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 12, background: 'var(--bg-main)', color: 'var(--text-dark)' }}>
                  {o.customer.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-md fw-600 text-dark">{o.customer.name}</div>
                  <div className="text-xs text-muted">{o.id} · {o.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-md fw-700 text-dark">{formatBRL(o.total)}</div>
                  <StatusPill status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad-lg">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="text-lg fw-700 text-dark">Mais vendidos (30d)</div>
              <div className="text-sm text-muted">Top 5 produtos</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate?.('produtos')}>
              Ver catálogo <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topProducts.map((p, i) => (
              <div key={p.name}>
                <div className="flex justify-between mb-12" style={{ marginBottom: 6 }}>
                  <div className="text-md fw-600 text-dark">
                    <span className="text-muted" style={{ marginRight: 8 }}>#{i + 1}</span>
                    {p.name}
                  </div>
                  <div className="text-md fw-600 text-dark">{p.count}</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${(p.count / maxTopProduct) * 100}%` }} />
                </div>
                <div className="text-xs text-muted" style={{ marginTop: 4 }}>{formatBRL(p.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function StatusLine({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-md" style={{ marginBottom: 6 }}>
        <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{label}</span>
        <span className="fw-700 text-dark">{count}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    new: { label: 'Novo', cls: 'pill-primary' },
    preparing: { label: 'Preparo', cls: 'pill-info' },
    ready: { label: 'Pronto', cls: 'pill-warning' },
    shipping: { label: 'Em entrega', cls: 'pill-success' },
  }
  const s = map[status] || { label: status, cls: 'pill-neutral' }
  return (
    <span className={`pill ${s.cls}`} style={{ marginTop: 2 }}>
      <span className="pill-dot" />
      {s.label}
    </span>
  )
}
