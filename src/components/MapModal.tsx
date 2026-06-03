import { X, Navigation, Phone, MessageCircle, Bike, Store, Flag } from 'lucide-react'
import type { Driver, Order } from '../data/mock'
import { store } from '../data/mock'

interface MapModalProps {
  driver?: Driver | null
  order?: Order | null
  onClose: () => void
}

export function MapModal({ driver, order, onClose }: MapModalProps) {
  const stage = driver?.deliveryStage ?? 'going_to_pickup'
  const stageLabel: Record<string, string> = {
    going_to_pickup: 'Indo ao restaurante',
    at_pickup: 'No restaurante',
    going_to_drop: 'A caminho do cliente',
    at_drop: 'No cliente',
  }
  const driverPosition = {
    going_to_pickup: { top: '60%', left: '20%' },
    at_pickup: { top: '25%', left: '30%' },
    going_to_drop: { top: '50%', left: '55%' },
    at_drop: { top: '70%', left: '75%' },
  }[stage]

  const openExternalMaps = () => {
    if (!order) return
    const addr = encodeURIComponent(order.customer.address)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, '_blank')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 680, padding: 0 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Localização do motoboy</div>
            <div className="text-xs text-muted mt-8">
              {driver ? `${driver.name} · ${stageLabel[stage]}` : 'Sem entregador atribuído'}
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="map-canvas">
          {/* Grid */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h-${i}`} className="map-grid-h" style={{ top: `${(i + 1) * 10}%` }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} className="map-grid-v" style={{ left: `${(i + 1) * 10}%` }} />
          ))}

          {/* Route line */}
          <svg className="map-route" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 25 30 Q 40 40, 50 50 T 75 70"
              stroke="var(--primary)"
              strokeWidth="0.8"
              strokeDasharray="2,1.5"
              fill="none"
            />
          </svg>

          {/* Restaurant pin */}
          <div className="map-pin" style={{ top: '25%', left: '25%' }}>
            <div className="map-pin-dot"><Store size={14} color="white" /></div>
            <div className="map-pin-label">{store.name}</div>
          </div>

          {/* Customer pin */}
          {order && (
            <div className="map-pin" style={{ top: '70%', left: '75%' }}>
              <div className="map-pin-dot"><Flag size={14} color="white" /></div>
              <div className="map-pin-label">{order.customer.name.split(' ')[0]}</div>
            </div>
          )}

          {/* Driver marker (animated) */}
          {driver && driverPosition && (
            <div className="map-driver" style={driverPosition as any}>
              <div className="map-driver-pulse" />
              <div className="map-driver-dot"><Bike size={14} color="white" /></div>
            </div>
          )}

          {/* Info tag */}
          {driver?.etaMin != null && (
            <div className="map-info-tag">
              <Navigation size={12} />
              <span>~{driver.etaMin} min · {stageLabel[stage]}</span>
            </div>
          )}
        </div>

        {driver && (
          <div className="map-footer">
            <div className="flex items-center gap-12" style={{ flex: 1 }}>
              <div className="user-avatar" style={{ background: 'var(--bg-main)', color: 'var(--text-dark)' }}>
                {driver.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="text-md fw-700 text-dark">{driver.name}</div>
                <div className="text-xs text-muted">{driver.vehicle} · {driver.plate}</div>
              </div>
            </div>
            <div className="flex gap-8">
              <button className="btn btn-outline btn-sm"><Phone size={14} /></button>
              <button className="btn btn-outline btn-sm"><MessageCircle size={14} /></button>
              <button className="btn btn-primary btn-sm" onClick={openExternalMaps}>
                <Navigation size={14} /> Abrir no Maps
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
