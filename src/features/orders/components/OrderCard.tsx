import { Clock, MapPin, Printer, ArrowRight, CreditCard, Bike, QrCode, Star, FileText, Banknote, Sparkles, Navigation } from 'lucide-react'
import type { Order, OrderStatus } from '../../../data/mock'
import { formatBRL } from '../../../lib/format'

interface OrderCardProps {
  order: Order
  actionLabel: string
  nextStatus: OrderStatus | null
  onOpen: () => void
  onAction: () => void
}

const paymentIcon = (type: Order['paymentType']) => {
  if (type === 'cash') return Banknote
  if (type === 'pix') return Sparkles
  return CreditCard
}

export function OrderCard({ order, actionLabel, nextStatus, onOpen, onAction }: OrderCardProps) {
  const itemsCount = order.items.reduce((a, i) => a + i.q, 0)
  const PayIcon = paymentIcon(order.paymentType)
  const changeBack = order.changeFor != null ? order.changeFor - order.total : 0

  return (
    <div className={`kanban-card ${order.status}`} onClick={onOpen}>
      {/* Header */}
      <div className="kanban-card-row">
        <div className="flex items-center gap-8">
          <span className="kanban-card-id">{order.id}</span>
          {order.customer.isFirstOrder && (
            <span className="pill pill-primary" style={{ padding: '2px 6px', fontSize: 10 }}>1º pedido</span>
          )}
        </div>
        <span className="kanban-card-time">
          <Clock size={12} /> {order.time}
        </span>
      </div>

      {/* Customer */}
      <div>
        <div className="kanban-customer">{order.customer.name}</div>
        <div className="kanban-meta-line" style={{ marginTop: 4 }}>
          <MapPin size={12} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {order.customer.address}
          </span>
          {order.customer.distanceKm != null && (
            <span className="text-xs fw-600 text-dark" style={{ marginLeft: 'auto' }}>{order.customer.distanceKm} km</span>
          )}
        </div>
        {order.customer.complement && (
          <div className="text-xs text-muted" style={{ marginTop: 2, paddingLeft: 18 }}>
            ↳ {order.customer.complement}
          </div>
        )}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--text-main)', paddingTop: 8, borderTop: '1px dashed var(--border)' }}>
        {order.items.map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="text-primary fw-700" style={{ minWidth: 18 }}>{item.q}×</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </span>
              <span className="text-muted text-xs">{formatBRL(item.price * item.q)}</span>
            </div>
            {item.notes && (
              <div className="text-xs text-muted" style={{ paddingLeft: 24, marginTop: 2 }}>
                ↳ {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Customer note */}
      {order.customer.notes && (
        <div style={{
          display: 'flex',
          gap: 6,
          alignItems: 'flex-start',
          background: 'var(--warning-light)',
          padding: '8px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 11,
          color: 'var(--warning)',
          fontWeight: 500,
        }}>
          <FileText size={12} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{order.customer.notes}</span>
        </div>
      )}

      {/* Payment row */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '10px 12px',
        background: order.paymentType === 'cash' && !order.paid ? 'var(--warning-light)' : 'var(--bg-soft)',
        borderRadius: 'var(--radius-sm)',
        border: order.paymentType === 'cash' && !order.paid ? '1px solid var(--warning)' : '1px solid var(--border-light)',
      }}>
        <div className="flex items-center gap-8">
          <PayIcon size={14} color={order.paymentType === 'cash' ? 'var(--warning)' : 'var(--text-muted)'} />
          <span className="text-xs fw-600 text-dark" style={{ flex: 1 }}>{order.payment}</span>
          {order.paid ? (
            <span className="pill pill-success" style={{ padding: '2px 6px', fontSize: 10 }}>Quitado</span>
          ) : (
            <span className="pill pill-warning" style={{ padding: '2px 6px', fontSize: 10 }}>Cobrar</span>
          )}
        </div>
        {order.changeFor != null && (
          <div className="text-xs fw-600" style={{ color: 'var(--warning)' }}>
            Troco para {formatBRL(order.changeFor)} · devolver {formatBRL(changeBack)}
          </div>
        )}
        {order.couponCode && (
          <div className="text-xs text-primary fw-600">
            Cupom {order.couponCode} · - {formatBRL(order.discount ?? 0)}
          </div>
        )}
      </div>

      {/* Pickup code + driver */}
      {(order.status === 'ready' || order.status === 'shipping') && (
        <div className="kanban-pickup-code">
          <div className="flex col">
            <span className="kanban-pickup-label">Código motoboy</span>
          </div>
          <span className="kanban-pickup-value">{order.pickupCode}</span>
        </div>
      )}

      {(order.status === 'shipping' || order.status === 'ready') && order.driver && (
        <div className="kanban-driver">
          <div className="kanban-driver-avatar">{order.driver.initials}</div>
          <div className="kanban-driver-info">
            <div className="kanban-driver-name">{order.driver.name}</div>
            <div className="kanban-driver-meta">
              {order.driver.plate} · <Star size={9} style={{ verticalAlign: 'middle' }} /> {order.driver.rating}
            </div>
          </div>
          {order.status === 'ready' && (
            <span className="pill pill-warning" style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: 10 }}>A caminho</span>
          )}
          {order.status === 'shipping' && (
            <button
              className="btn-icon"
              title="Ver no mapa"
              onClick={e => { e.stopPropagation(); onOpen() }}
              style={{ marginLeft: 'auto' }}
            >
              <Navigation size={14} />
            </button>
          )}
        </div>
      )}
      {order.status === 'ready' && !order.driver && (
        <div className="kanban-driver" style={{ background: 'var(--warning-light)' }}>
          <Bike size={16} color="var(--warning)" />
          <div className="kanban-driver-info">
            <div className="kanban-driver-name">Aguardando motoboy</div>
            <div className="kanban-driver-meta">Pedido liberado para entregadores</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="kanban-footer">
        <span className="text-xs text-muted">{itemsCount} {itemsCount === 1 ? 'item' : 'itens'} · {order.prepTimeMin} min</span>
        <span className="kanban-total">{formatBRL(order.total)}</span>
      </div>

      {/* Actions */}
      <div className="kanban-actions">
        <button
          className="btn-icon"
          title="Imprimir comanda"
          onClick={e => { e.stopPropagation() }}
        >
          <Printer size={16} />
        </button>
        {order.status === 'ready' ? (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={e => { e.stopPropagation(); onAction() }}
          >
            <QrCode size={14} /> {actionLabel}
          </button>
        ) : nextStatus ? (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={e => { e.stopPropagation(); onAction() }}
          >
            {actionLabel} <ArrowRight size={14} />
          </button>
        ) : (
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} disabled>
            <Bike size={14} /> {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
