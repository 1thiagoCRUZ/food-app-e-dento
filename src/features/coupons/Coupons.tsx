import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CouponTable, Coupon } from './components/CouponTable';
import { CouponFormModal } from './components/CouponFormModal';

export function Coupons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 1, code: 'NOVO30', discount: '30%', min: 'R$30.00', uses: 156, validity: '2026-05-30', active: true },
    { id: 2, code: 'FRETEGRATIS', discount: 'Frete Grátis', min: 'R$50.00', uses: 89, validity: '2026-06-15', active: true },
    { id: 3, code: 'VOLTA10', discount: 'R$10', min: 'R$40.00', uses: 234, validity: '2026-04-01', active: false },
  ]);

  const toggleStatus = (id: number) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const handleSave = (data: any) => {
    // Logic to add a new coupon goes here.
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cupons</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Novo Cupom
        </button>
      </div>

      <CouponTable coupons={coupons} onToggleStatus={toggleStatus} />

      {isModalOpen && (
        <CouponFormModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}
