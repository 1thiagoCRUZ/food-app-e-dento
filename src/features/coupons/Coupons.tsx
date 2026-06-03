import { useState } from 'react'
import { Plus, Ticket, TrendingUp, Calendar } from 'lucide-react'
import { CouponTable } from './components/CouponTable'
import { CouponFormModal } from './components/CouponFormModal'
import { coupons as initialCoupons, type Coupon } from '../../data/mock'

export function Coupons() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)

  const toggleStatus = (id: number) =>
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))

  const activeCount = coupons.filter(c => c.active).length
  const totalUses = coupons.reduce((acc, c) => acc + c.uses, 0)
  const expiringCount = coupons.filter(c => {
    const d = new Date(c.validity)
    const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return diff <= 30 && diff > 0 && c.active
  }).length

  const handleSave = () => setIsModalOpen(false)

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cupons</h1>
          <p className="page-subtitle">Promoções e descontos disponíveis para seus clientes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Novo cupom
        </button>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Cupons ativos</span>
            <div className="stat-icon"><Ticket size={18} /></div>
          </div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-delta">{coupons.length} cadastrados no total</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Usos totais</span>
            <div className="stat-icon"><TrendingUp size={18} /></div>
          </div>
          <div className="stat-value">{totalUses}</div>
          <div className="stat-delta up">+18% vs mês passado</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Vencem em 30 dias</span>
            <div className="stat-icon" style={expiringCount > 0 ? { background: 'var(--warning-light)', color: 'var(--warning)' } : undefined}>
              <Calendar size={18} />
            </div>
          </div>
          <div className="stat-value">{expiringCount}</div>
          <div className="stat-delta">Revise antes de expirar</div>
        </div>
      </div>

      <CouponTable coupons={coupons} onToggleStatus={toggleStatus} />

      {isModalOpen && (
        <CouponFormModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      )}
    </>
  )
}
