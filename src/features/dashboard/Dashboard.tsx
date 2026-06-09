import { useState, useEffect } from 'react'
import { ShoppingBag, DollarSign, TrendingUp, Clock, ArrowUp, ArrowDown, ChevronRight, Bike } from 'lucide-react'
import { api } from '../../lib/api'
import { type Order, type Driver } from '../../data/mock'
import { formatBRL } from '../../lib/format'

interface DashboardProps {
  onNavigate?: (path: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const RESTAURANT_ID = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [ordersData, couriersData] = await Promise.all([
          api.get(`/orders/restaurant/${RESTAURANT_ID}`),
          api.get(`/couriers`)
        ])
        
        const mappedOrders: Order[] = ordersData.map((o: any) => ({
          id: o.id.toString(),
          customer: { name: `Cliente ${o.userId}`, phone: '(11) 99999-9999' },
          items: o.items.map((i: any) => ({ name: i.name, quantity: i.quantity, price: parseFloat(i.price) })),
          total: parseFloat(o.total),
          status: mapStatus(o.status),
          time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }))
        setOrders(mappedOrders)

        const mappedDrivers: Driver[] = couriersData.map((c: any) => ({
          id: c.id.toString(),
          name: `Entregador ${c.userId}`,
          initials: `E${c.userId}`,
          phone: '',
          vehicle: '',
          plate: '',
          rating: 5,
          totalDeliveries: 0,
          distanceKm: null,
          status: c.isOnline ? 'available' : 'offline',
          currentOrderId: null,
          deliveryStage: null,
          etaMin: null,
        }))
        setDrivers(mappedDrivers)
      } catch (error) {
        console.error('Failed to fetch dashboard data', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const mapStatus = (status: string) => {
    if (status === 'AWAITING_PAYMENT' || status === 'NEW') return 'new';
    if (status === 'PREPARING') return 'preparing';
    if (status === 'READY_FOR_PICKUP') return 'ready';
    if (status === 'OUT_FOR_DELIVERY') return 'shipping';
    if (status === 'DELIVERED') return 'delivered';
    if (status === 'CANCELLED') return 'cancelled';
    return 'new';
  }

  const todayOrders = orders.length
  const todayRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  const avgTicket = todayOrders > 0 ? todayRevenue / todayOrders : 0
  const avgPrepTime = 28 // Mocked for now

  const newCount = orders.filter(o => o.status === 'new').length
  const preparingCount = orders.filter(o => o.status === 'preparing').length
  const readyCount = orders.filter(o => o.status === 'ready').length
  const shippingCount = orders.filter(o => o.status === 'shipping').length

  const availableDrivers = drivers.filter(d => d.status === 'available').length
  const busyDrivers = drivers.filter(d => d.status === 'busy').length

  // Simplified mock for charts to avoid complex aggregation logic in UI component for now
  const hourlyOrders = [{hour: '10h', count: 0}, {hour: '11h', count: todayOrders}, {hour: '12h', count: 0}]
  const topProducts = [{name: 'Produto Destaque', count: 0, revenue: 0}]
  
  const maxHourly = Math.max(...hourlyOrders.map(h => h.count), 1)
  const maxTopProduct = Math.max(...topProducts.map(p => p.count), 1)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pulse 1.5s infinite ease-in-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '200px', height: '28px', background: 'var(--border-light)', borderRadius: '6px', marginBottom: '8px' }} />
            <div style={{ width: '300px', height: '16px', background: 'var(--bg-main)', borderRadius: '4px' }} />
          </div>
          <div style={{ width: '240px', height: '36px', background: 'var(--border-light)', borderRadius: '6px' }} />
        </div>
        <div className="stat-grid">
          {[1, 2, 3].map(i => <div key={i} className="stat-card" style={{ height: '110px', background: 'var(--bg-white)', borderColor: 'var(--border-light)' }}>
            <div style={{ width: '40%', height: '14px', background: 'var(--bg-main)', borderRadius: '4px', marginBottom: '16px' }} />
            <div style={{ width: '60%', height: '28px', background: 'var(--border-light)', borderRadius: '6px', marginBottom: '12px' }} />
            <div style={{ width: '50%', height: '12px', background: 'var(--bg-main)', borderRadius: '4px' }} />
          </div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div className="card card-pad-lg" style={{ height: '280px', background: 'var(--bg-white)' }}>
             <div style={{ width: '30%', height: '20px', background: 'var(--border-light)', borderRadius: '4px', marginBottom: '8px' }} />
             <div style={{ width: '40%', height: '14px', background: 'var(--bg-main)', borderRadius: '4px' }} />
          </div>
          <div className="card card-pad-lg" style={{ height: '280px', background: 'var(--bg-white)' }}>
             <div style={{ width: '50%', height: '20px', background: 'var(--border-light)', borderRadius: '4px', marginBottom: '24px' }} />
             {[1, 2, 3, 4].map(i => <div key={i} style={{ width: '100%', height: '32px', background: 'var(--bg-main)', borderRadius: '6px', marginBottom: '12px' }} />)}
          </div>
        </div>
      </div>
    )
  }

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
