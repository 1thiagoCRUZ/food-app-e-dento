export interface Coupon {
  id: number;
  code: string;
  discount: string;
  min: string;
  uses: number;
  validity: string;
  active: boolean;
}

interface CouponTableProps {
  coupons: Coupon[];
  onToggleStatus: (id: number) => void;
}

export function CouponTable({ coupons, onToggleStatus }: CouponTableProps) {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Desconto</th>
            <th>Pedido Min.</th>
            <th>Usos</th>
            <th>Validade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{coupon.code}</td>
              <td>{coupon.discount}</td>
              <td>{coupon.min}</td>
              <td>{coupon.uses}</td>
              <td>{coupon.validity}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div 
                    onClick={() => onToggleStatus(coupon.id)}
                    style={{ 
                    width: 40, 
                    height: 24, 
                    borderRadius: 9999, 
                    backgroundColor: coupon.active ? 'var(--primary)' : 'var(--border)', 
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: 2,
                      left: coupon.active ? 18 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}></div>
                  </div>
                  <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: 9999, 
                    fontSize: 12, 
                    fontWeight: 600,
                    backgroundColor: coupon.active ? 'var(--primary)' : 'var(--border-light)',
                    color: coupon.active ? '#fff' : 'var(--text-light)'
                  }}>
                    {coupon.active ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
