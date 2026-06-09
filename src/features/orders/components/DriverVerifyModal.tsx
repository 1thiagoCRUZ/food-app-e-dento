import { useState } from 'react'
import { X, AlertCircle, CheckCircle2, Bike, Star, Phone, MessageCircle } from 'lucide-react'
import type { Order, Driver } from '../../../data/mock'
import { formatPhone } from '../../../lib/format'

interface DriverVerifyModalProps {
  order: Order
  drivers: Driver[]
  onClose: () => void
  onVerified: (driverId: string, code: string) => void
}

export function DriverVerifyModal({ order, drivers, onClose, onVerified }: DriverVerifyModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const assigned = order.driver
  const driverRecord = assigned ? drivers.find(d => d.plate === assigned.plate) : null

  const confirm = () => {
    if (!assigned) {
      setError('Nenhum entregador aceitou este pedido ainda.')
      return
    }
    if (code !== order.pickupCode) {
      setError('Código incorreto. Peça ao motoboy o código do app dele.')
      return
    }
    setError(null)
    setSuccess(true)
    setTimeout(() => onVerified(driverRecord?.id ?? 'D-X', code), 700)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Confirmar retirada</div>
            <div className="text-xs text-muted mt-8">Pedido {order.id} · {order.customer.name}</div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--primary-light)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <div className="text-lg fw-700 text-dark">Pedido entregue ao motoboy!</div>
              <div className="text-sm text-muted mt-8">Liberando para entrega…</div>
            </div>
          ) : (
            <>
              {!assigned ? (
                <div className="empty-state" style={{ padding: '24px 12px' }}>
                  <div className="empty-state-icon"><Bike size={28} /></div>
                  <div className="empty-state-title">Aguardando motoboy aceitar</div>
                  <div className="empty-state-text">
                    O pedido foi liberado e está disponível para os entregadores da área. Assim que alguém aceitar, aparecerá aqui.
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="section-label">Motoboy designado</div>
                    <div className="info-card">
                      <div className="flex items-center gap-12">
                        <div className="user-avatar" style={{ background: 'var(--bg-white)', color: 'var(--text-dark)', width: 44, height: 44 }}>
                          {assigned.initials}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="text-md fw-700 text-dark">{assigned.name}</div>
                          <div className="text-xs text-muted">{assigned.vehicle} · <strong>{assigned.plate}</strong></div>
                          <div className="text-xs text-muted flex items-center gap-8" style={{ marginTop: 2 }}>
                            <span className="flex items-center gap-4"><Star size={10} /> {assigned.rating}</span>
                            <span>·</span>
                            <span>{formatPhone(assigned.phone)}</span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button className="btn-icon" title="Ligar"><Phone size={16} /></button>
                          <button className="btn-icon" title="WhatsApp"><MessageCircle size={16} /></button>
                        </div>
                      </div>
                    </div>
                    <div className="field-hint" style={{ marginTop: 8 }}>
                      O motoboy aceitou pelo app dele. Confira a placa antes de entregar o pedido.
                    </div>
                  </div>

                  <div>
                    <div className="section-label">Digite o código do app do motoboy</div>
                    <div className="field">
                      <input
                        type="text"
                        className="input"
                        value={code}
                        onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(null) }}
                        placeholder="0000"
                        maxLength={4}
                        style={{
                          textAlign: 'center',
                          fontSize: 28,
                          letterSpacing: 12,
                          fontWeight: 700,
                          color: 'var(--text-dark)',
                          padding: '14px 12px',
                        }}
                        autoFocus
                      />
                      <div className="field-hint">
                        Esperado: <strong>{order.pickupCode}</strong> (apenas para demo)
                      </div>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="flex items-center gap-8" style={{
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  padding: 12,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                }}>
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {!success && (
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button
              className="btn btn-primary"
              disabled={!assigned || code.length !== 4}
              onClick={confirm}
            >
              <CheckCircle2 size={16} /> Confirmar entrega ao motoboy
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
