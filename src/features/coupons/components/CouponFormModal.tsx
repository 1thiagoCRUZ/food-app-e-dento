import { useState } from 'react'
import { X, Percent, DollarSign, Truck } from 'lucide-react'

interface CouponFormModalProps {
  onClose: () => void
  onSave: (data: any) => void
}

const types = [
  { id: 'percent', label: 'Percentual', icon: Percent, hint: 'Ex: 10% OFF' },
  { id: 'fixed', label: 'Valor fixo', icon: DollarSign, hint: 'Ex: R$ 10 OFF' },
  { id: 'shipping', label: 'Frete grátis', icon: Truck, hint: 'Isenta a entrega' },
]

export function CouponFormModal({ onClose, onSave }: CouponFormModalProps) {
  const [type, setType] = useState('percent')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Novo cupom</div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Tipo de cupom</label>
            <div className="row" style={{ gap: 8 }}>
              {types.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    border: `1.5px solid ${type === t.id ? 'var(--primary)' : 'var(--border)'}`,
                    background: type === t.id ? 'var(--primary-light)' : 'var(--bg-white)',
                    color: type === t.id ? 'var(--primary-dark)' : 'var(--text-main)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s',
                  }}
                >
                  <t.icon size={20} />
                  <span className="text-md fw-600">{t.label}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Código</label>
            <input className="input" placeholder="Ex: NOVO10" style={{ textTransform: 'uppercase', letterSpacing: 1 }} />
            <div className="field-hint">Apenas letras e números, sem espaços</div>
          </div>

          <div className="row">
            {type !== 'shipping' && (
              <div className="field">
                <label>{type === 'percent' ? 'Desconto (%)' : 'Desconto (R$)'}</label>
                <input className="input" placeholder={type === 'percent' ? 'Ex: 10' : 'Ex: 10,00'} />
              </div>
            )}
            <div className="field">
              <label>Pedido mínimo (R$)</label>
              <input className="input" placeholder="Ex: 50,00" />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Validade</label>
              <input className="input" type="date" />
            </div>
            <div className="field">
              <label>Limite de usos</label>
              <input className="input" type="number" placeholder="Ex: 100" />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onSave({})}>Salvar cupom</button>
        </div>
      </div>
    </div>
  )
}
