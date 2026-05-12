import { X } from 'lucide-react';

interface CouponFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CouponFormModal({ onClose, onSave }: CouponFormModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-white)',
        borderRadius: 'var(--radius)',
        width: '100%',
        maxWidth: 500,
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 16px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>Cadastrar Cupom</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Código</label>
            <input type="text" placeholder="Ex: NOVO10" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--primary)', outline: 'none', color: 'var(--text-dark)', fontFamily: 'inherit', textTransform: 'uppercase' }} />
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Desconto</label>
              <input type="text" placeholder="Ex: 10% ou R$10" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none', color: 'var(--text-dark)', fontFamily: 'inherit' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Pedido Mínimo</label>
              <input type="text" placeholder="Ex: R$ 50,00" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none', color: 'var(--text-dark)', fontFamily: 'inherit' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Validade</label>
            <input type="date" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none', color: 'var(--text-dark)', fontFamily: 'inherit' }} />
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8, padding: 12, fontSize: 14 }} onClick={() => onSave({})}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
