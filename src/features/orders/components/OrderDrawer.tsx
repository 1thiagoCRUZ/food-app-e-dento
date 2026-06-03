import { useState } from 'react'
import { X, MapPin, Phone, MessageCircle, User, Clock, CreditCard, Tag, FileText, ArrowRight, Printer, Bike, Star, QrCode, XCircle, Navigation, Banknote } from 'lucide-react'
import type { Order } from '../../../data/mock'
import { drivers } from '../../../data/mock'
import { formatBRL, formatPhone } from '../../../lib/format'
import { MapModal } from '../../../components/MapModal'

interface OrderDrawerProps {
  order: Order
  onClose: () => void
  onAdvance: () => void
  onCancel: () => void
}

const STATUS_INFO: Record<Order['status'], { label: string; pill: string; next: string | null }> = {
  new: { label: 'Novo pedido', pill: 'pill-primary', next: 'Aceitar e iniciar preparo' },
  preparing: { label: 'Em preparo', pill: 'pill-info', next: 'Marcar como pronto' },
  ready: { label: 'Pronto para retirada', pill: 'pill-warning', next: 'Liberar para entregador' },
  shipping: { label: 'Em entrega', pill: 'pill-success', next: null },
}

export function OrderDrawer({ order, onClose, onAdvance, onCancel }: OrderDrawerProps) {
  const [mapOpen, setMapOpen] = useState(false)
  const status = STATUS_INFO[order.status]
  const showPickupCode = order.status === 'ready' || order.status === 'shipping'
  const changeBack = order.changeFor != null ? order.changeFor - order.total : 0
  const driverRecord = order.driver ? drivers.find(d => d.plate === order.driver!.plate) : null

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div className="flex gap-8 items-center">
              <span className="text-lg fw-700 text-dark">{order.id}</span>
              <span className={`pill ${status.pill}`}>
                <span className="pill-dot" /> {status.label}
              </span>
            </div>
            <div className="text-xs text-muted mt-8">{order.placedAt}</div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="drawer-body">
          {showPickupCode && (
            <div className="pickup-card-big">
              <div>
                <div className="pickup-card-big-label">Código motoboy</div>
                <div className="pickup-card-big-hint">Confirme com o entregador na retirada</div>
              </div>
              <div className="pickup-card-big-value">{order.pickupCode}</div>
            </div>
          )}

          {order.status === 'shipping' && order.driver && (
            <div>
              <div className="section-label">Entregador</div>
              <div className="info-card">
                <div className="flex items-center gap-12">
                  <div className="user-avatar" style={{ background: 'var(--bg-white)', color: 'var(--text-dark)' }}>
                    {order.driver.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-md fw-700 text-dark">{order.driver.name}</div>
                    <div className="text-xs text-muted">
                      {order.driver.vehicle} · {order.driver.plate}
                    </div>
                    <div className="text-xs text-muted flex items-center gap-4" style={{ marginTop: 2 }}>
                      <Star size={10} /> {order.driver.rating}
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <button className="btn-icon" title="Ligar"><Phone size={16} /></button>
                    <button className="btn-icon" title="WhatsApp"><MessageCircle size={16} /></button>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: 4 }}
                  onClick={() => setMapOpen(true)}
                >
                  <Navigation size={14} /> Ver no mapa e rota
                </button>
              </div>
            </div>
          )}

          <div>
            <div className="section-label">Cliente</div>
            <div className="info-card">
              <div className="info-row">
                <User size={16} />
                <div className="info-row-text">
                  <div className="info-row-label">Nome</div>
                  <div className="info-row-value">{order.customer.name}</div>
                </div>
              </div>
              <div className="info-row">
                <Phone size={16} />
                <div className="info-row-text">
                  <div className="info-row-label">Telefone</div>
                  <div className="info-row-value">{formatPhone(order.customer.phone)}</div>
                </div>
              </div>
              <div className="info-row">
                <MapPin size={16} />
                <div className="info-row-text">
                  <div className="info-row-label">
                    Endereço {order.customer.distanceKm && `· ${order.customer.distanceKm} km`}
                  </div>
                  <div className="info-row-value">{order.customer.address}</div>
                  {order.customer.complement && (
                    <div className="text-xs text-muted" style={{ marginTop: 2 }}>{order.customer.complement}</div>
                  )}
                  {order.customer.reference && (
                    <div className="text-xs text-muted" style={{ marginTop: 2 }}>Ref: {order.customer.reference}</div>
                  )}
                </div>
              </div>
              {order.customer.notes && (
                <div className="info-row">
                  <FileText size={16} />
                  <div className="info-row-text">
                    <div className="info-row-label">Observações do cliente</div>
                    <div className="info-row-value">{order.customer.notes}</div>
                  </div>
                </div>
              )}
              {order.customer.isFirstOrder && (
                <div className="pill pill-primary" style={{ alignSelf: 'flex-start' }}>
                  <Star size={10} /> 1º pedido na sua loja
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="section-label">Itens ({order.items.length})</div>
            <div className="items-card">
              {order.items.map((item, i) => (
                <div key={i} className="item-row">
                  <span className="item-qty">{item.q}×</span>
                  <div className="item-name">
                    {item.name}
                    {item.notes && (
                      <div className="text-xs text-muted" style={{ marginTop: 2 }}>↳ {item.notes}</div>
                    )}
                  </div>
                  <span className="item-price">{formatBRL(item.price * item.q)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label">Pagamento</div>
            <div className="payment-card">
              <div className="flex items-center gap-8 mb-12">
                <CreditCard size={16} color="var(--text-muted)" />
                <span className="text-md fw-600 text-dark" style={{ flex: 1 }}>{order.payment}</span>
                {order.paid ? (
                  <span className="pill pill-success">Quitado</span>
                ) : (
                  <span className="pill pill-warning">Cobrar na entrega</span>
                )}
              </div>
              <div className="payment-row">
                <span>Subtotal</span>
                <span>{formatBRL(order.subtotal)}</span>
              </div>
              <div className="payment-row">
                <span>Taxa de entrega</span>
                <span>{formatBRL(order.deliveryFee)}</span>
              </div>
              {order.discount && (
                <div className="payment-row" style={{ color: 'var(--primary)' }}>
                  <span className="flex items-center gap-4"><Tag size={12} /> Cupom {order.couponCode}</span>
                  <span>- {formatBRL(order.discount)}</span>
                </div>
              )}
              <div className="payment-row total">
                <span>Total</span>
                <span>{formatBRL(order.total)}</span>
              </div>
              {order.changeFor != null && (
                <div style={{
                  marginTop: 10,
                  padding: 12,
                  background: 'var(--warning-light)',
                  border: '1px solid var(--warning)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <div className="flex items-center gap-8 mb-12" style={{ color: 'var(--warning)', fontWeight: 700, fontSize: 12 }}>
                    <Banknote size={14} /> TROCO
                  </div>
                  <div className="payment-row" style={{ padding: '2px 0' }}>
                    <span>Cliente vai pagar com</span>
                    <span className="fw-700 text-dark">{formatBRL(order.changeFor)}</span>
                  </div>
                  <div className="payment-row" style={{ padding: '2px 0', color: 'var(--warning)' }}>
                    <span className="fw-700">Levar troco de</span>
                    <span className="fw-700">{formatBRL(changeBack)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="section-label">Operação</div>
            <div className="info-card">
              <div className="info-row">
                <Clock size={16} />
                <div className="info-row-text">
                  <div className="info-row-label">Tempo de preparo</div>
                  <div className="info-row-value">{order.prepTimeMin} min</div>
                </div>
              </div>
              <div className="info-row">
                <Bike size={16} />
                <div className="info-row-text">
                  <div className="info-row-label">Etapa atual</div>
                  <div className="info-row-value">{status.label}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          {order.status === 'new' && (
            <button className="btn btn-outline" onClick={onCancel}>
              <XCircle size={16} /> Recusar
            </button>
          )}
          <button className="btn btn-outline" title="Imprimir comanda">
            <Printer size={16} />
          </button>
          {status.next ? (
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={onAdvance}>
              {order.status === 'ready' ? <QrCode size={16} /> : <ArrowRight size={16} />}
              {status.next}
            </button>
          ) : (
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMapOpen(true)}>
              <Navigation size={16} /> Acompanhar no mapa
            </button>
          )}
        </div>
      </div>

      {mapOpen && (
        <MapModal
          driver={driverRecord}
          order={order}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  )
}
