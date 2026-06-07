import { useState, useEffect } from 'react'
import { Plus, Ticket, TrendingUp, Calendar } from 'lucide-react'
import { CouponTable } from './components/CouponTable'
import { CouponFormModal } from './components/CouponFormModal'
import type { Coupon } from '../../data/mock'
import { api } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

export function Coupons() {
  const { user, restaurant } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (restaurant || user?.role !== 'RESTAURANT') {
      fetchCoupons();
    }
  }, [restaurant, user]);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const url = restaurant ? `/coupons?restaurantId=${restaurant.id}` : '/coupons';
      const data = await api.get(url);
      setCoupons(data);
    } catch (error) {
      console.error('Failed to fetch coupons', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;

    // Optimistic update
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    
    // NOTE: Ideally the backend has a /coupons/:id/toggle endpoint or we PUT the whole object.
    // Assuming we have an update endpoint or we'll just log it for now.
    // try { await api.patch(`/coupons/${id}/status`, { active: !coupon.active }); }
    // catch (e) { setCoupons(...) }
  }

  const activeCount = coupons.filter(c => c.isActive).length
  const totalUses = coupons.reduce((acc, c) => acc + (c.uses || 0), 0)
  const expiringCount = coupons.filter(c => {
    if (!c.expiresAt) return false;
    const d = new Date(c.expiresAt)
    const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return diff <= 30 && diff > 0 && c.isActive
  }).length

  const handleSave = async (data: any) => {
    try {
      await api.post('/coupons', { ...data, restaurantId: restaurant?.id });
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to save coupon', error);
      alert('Erro ao salvar cupom');
    }
  }

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
