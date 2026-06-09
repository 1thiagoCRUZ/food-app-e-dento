import { useState, useEffect } from 'react'
import { Bike, Phone, MessageCircle, Star, MapPin, Search, Navigation, Store, Flag, Loader2 } from 'lucide-react'
import { orders, type DeliveryStage, type Driver } from '../../data/mock'
import { api } from '../../lib/api'
import { formatPhone } from '../../lib/format'
import { MapModal } from '../../components/MapModal'

const stages: { id: DeliveryStage; label: string; icon: any }[] = [
  { id: 'going_to_pickup', label: 'Indo ao restaurante', icon: Navigation },
  { id: 'at_pickup', label: 'No restaurante', icon: Store },
  { id: 'going_to_drop', label: 'A caminho do cliente', icon: Bike },
  { id: 'at_drop', label: 'No cliente', icon: Flag },
]

const stageMap: Record<DeliveryStage, { label: string; pill: string; short: string }> = {
  going_to_pickup: { label: 'Indo retirar', pill: 'pill-info', short: 'Ainda não chegou na retirada' },
  at_pickup: { label: 'Retirando', pill: 'pill-warning', short: 'No restaurante agora' },
  going_to_drop: { label: 'A caminho', pill: 'pill-primary', short: 'Levando para o cliente' },
  at_drop: { label: 'No cliente', pill: 'pill-success', short: 'Aguardando confirmação de entrega' },
}

export function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [mapDriver, setMapDriver] = useState<Driver | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDrivers = async () => {
    try {
      setIsLoading(true)
      const data = await api.get('/couriers')
      const mappedDrivers: Driver[] = data.map((c: any) => ({
        id: c.id.toString(),
        name: `Entregador #${c.userId}`,
        initials: `MB`,
        phone: '',
        vehicle: c.vehiclePlate ? 'Moto' : 'Não informado',
        plate: c.vehiclePlate || '-',
        rating: 5,
        totalDeliveries: c.totalDeliveries || 0,
        distanceKm: c.isOnline ? 1.2 : null,
        status: c.isOnline ? 'available' : 'offline',
        currentOrderId: null,
        deliveryStage: null,
        etaMin: null,
      }))
      setDrivers(mappedDrivers)
    } catch (error) {
      console.error('Failed to fetch drivers', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const delivering = drivers.filter(d => d.status === 'busy')
  const available = drivers.filter(d => d.status === 'available')
  const offline = drivers.filter(d => d.status === 'offline')

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Entregadores</h1>
          <p className="page-subtitle">Acompanhe os entregadores que aceitaram pedidos da sua loja e quem está disponível na área.</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Loader2 className="spin text-primary" size={48} />
        </div>
      ) : (
        <>
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat-card">
              <div className="stat-card-head">
                <span className="stat-label">Entregando agora</span>
                <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Bike size={18} />
                </div>
              </div>
              <div className="stat-value">{delivering.length}</div>
              <div className="stat-delta">Pedidos da sua loja em rota</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-head">
                <span className="stat-label">Disponíveis na área</span>
                <div className="stat-icon"><Bike size={18} /></div>
              </div>
              <div className="stat-value">{available.length}</div>
              <div className="stat-delta">Podem aceitar pedidos prontos</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-head">
                <span className="stat-label">Offline</span>
                <div className="stat-icon" style={{ background: 'var(--bg-main)', color: 'var(--text-light)' }}>
                  <Bike size={18} />
                </div>
              </div>
              <div className="stat-value">{offline.length}</div>
              <div className="stat-delta">Indisponíveis no momento</div>
            </div>
          </div>

      <div className="flex items-center justify-between mb-16" style={{ marginTop: 8 }}>
        <div>
          <div className="text-lg fw-700 text-dark">Em entrega agora</div>
          <div className="text-sm text-muted">Pedidos da sua loja que estão com motoboy</div>
        </div>
      </div>

      {delivering.length === 0 ? (
        <div className="card card-pad-lg empty-state">
          <div className="empty-state-icon"><Bike size={28} /></div>
          <div className="empty-state-title">Nenhuma entrega em andamento</div>
          <div className="empty-state-text">Quando um motoboy aceitar um pedido seu, ele aparece aqui com o progresso.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16, marginBottom: 24 }}>
          {delivering.map(d => {
            const order = orders.find(o => o.id === d.currentOrderId)
            const stage = d.deliveryStage ?? 'going_to_pickup'
            const stageIdx = stages.findIndex(s => s.id === stage)
            const stageInfo = stageMap[stage]
            return (
              <div key={d.id} className="card card-pad">
                <div className="flex items-center gap-12 mb-12">
                  <div className="user-avatar" style={{ background: 'var(--bg-main)', color: 'var(--text-dark)' }}>
                    {d.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-md fw-700 text-dark">{d.name}</div>
                    <div className="text-xs text-muted">{d.vehicle} · {d.plate}</div>
                  </div>
                  <span className={`pill ${stageInfo.pill}`}>
                    <span className="pill-dot" /> {stageInfo.label}
                  </span>
                </div>

                <div className="text-xs text-muted mb-12">{stageInfo.short}</div>

                <div className="stage-track">
                  {stages.map((s, i) => {
                    const done = i < stageIdx
                    const active = i === stageIdx
                    return (
                      <div key={s.id} className="stage-step">
                        <div className={`stage-dot ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                          {done ? '✓' : i + 1}
                        </div>
                        <div className={`stage-label ${active ? 'active' : ''}`}>{s.label}</div>
                        {i < stages.length - 1 && (
                          <div className={`stage-line ${done ? 'done' : ''}`} />
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between" style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
                  {order ? (
                    <div>
                      <div className="text-xs text-muted">Pedido</div>
                      <div className="text-md fw-700 text-dark">{order.id} · {order.customer.name}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted">Pedido não encontrado</div>
                  )}
                  {d.etaMin != null && (
                    <span className="pill pill-neutral">~{d.etaMin} min</span>
                  )}
                </div>

                <div className="flex gap-8" style={{ marginTop: 10 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => setMapDriver(d)}
                  >
                    <Navigation size={14} /> Ver no mapa
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <Phone size={14} />
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <MessageCircle size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between mb-16">
        <div>
          <div className="text-lg fw-700 text-dark">Disponíveis na área</div>
          <div className="text-sm text-muted">Quem pode aceitar próximos pedidos prontos da sua loja</div>
        </div>
        <div className="search-box" style={{ minWidth: 240 }}>
          <Search size={14} color="var(--text-light)" />
          <input placeholder="Buscar por nome ou placa…" />
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Entregador</th>
              <th>Veículo</th>
              <th>Avaliação</th>
              <th>Entregas</th>
              <th>Distância</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {[...available, ...offline].map(d => (
              <tr key={d.id}>
                <td>
                  <div className="flex items-center gap-12">
                    <div className="user-avatar" style={{ background: 'var(--bg-main)', color: 'var(--text-dark)' }}>
                      {d.initials}
                    </div>
                    <div>
                      <div className="text-md fw-700 text-dark">{d.name}</div>
                      <div className="text-xs text-muted">{formatPhone(d.phone)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-md text-dark">{d.vehicle}</div>
                  <div className="text-xs text-muted">{d.plate}</div>
                </td>
                <td>
                  <span className="flex items-center gap-4 text-dark fw-600">
                    <Star size={12} /> {d.rating}
                  </span>
                </td>
                <td><span className="text-dark fw-600">{d.totalDeliveries.toLocaleString('pt-BR')}</span></td>
                <td>
                  {d.distanceKm != null ? (
                    <span className="flex items-center gap-4 text-muted">
                      <MapPin size={12} /> {d.distanceKm} km
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  {d.status === 'available' && <span className="pill pill-success"><span className="pill-dot" /> Disponível</span>}
                  {d.status === 'offline' && <span className="pill pill-neutral"><span className="pill-dot" /> Offline</span>}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon" title="Ligar"><Phone size={16} /></button>
                  <button className="btn-icon" title="WhatsApp"><MessageCircle size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      )}

      {mapDriver && (
        <MapModal
          driver={mapDriver}
          order={orders.find(o => o.id === mapDriver.currentOrderId) ?? null}
          onClose={() => setMapDriver(null)}
        />
      )}
    </>
  )
}
