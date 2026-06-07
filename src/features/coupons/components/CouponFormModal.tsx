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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get('code'),
      type: type,
      value: (formData.get('discount') as string || '0').replace(',', '.'),
      min: parseFloat((formData.get('minOrder') as string || '0').replace(',', '.')),
      limit: parseInt(formData.get('usageLimit') as string || '0', 10),
      expiresAt: formData.get('validity') ? new Date(formData.get('validity') as string).toISOString() : new Date().toISOString(),
      isActive: true,
    };
    onSave(data);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
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
            <input className="input" name="code" placeholder="Ex: NOVO10" style={{ textTransform: 'uppercase', letterSpacing: 1 }} required />
            <div className="field-hint">Apenas letras e números, sem espaços</div>
          </div>

          <div className="row">
            {type !== 'shipping' && (
              <div className="field">
                <label>{type === 'percent' ? 'Desconto (%)' : 'Desconto (R$)'}</label>
                <input className="input" name="discount" placeholder={type === 'percent' ? 'Ex: 10' : 'Ex: 10,00'} required />
              </div>
            )}
            <div className="field">
              <label>Pedido mínimo (R$)</label>
              <input className="input" name="minOrder" placeholder="Ex: 50,00" />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Validade</label>
              <input className="input" name="validity" type="date" required />
            </div>
            <div className="field">
              <label>Limite de usos</label>
              <input className="input" name="usageLimit" type="number" placeholder="Ex: 100" />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Salvar cupom</button>
        </div>
      </form>
    </div>
  )
}
