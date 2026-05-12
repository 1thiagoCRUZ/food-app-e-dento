import { X, Image as ImageIcon } from 'lucide-react';

interface ProductFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  product?: any;
}

export function ProductFormModal({ onClose, onSave, product }: ProductFormModalProps) {
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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
            {product ? 'Editar Produto' : 'Cadastrar Produto'}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Nome</label>
            <input type="text" defaultValue={product?.name} placeholder="Nome do produto" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--primary)', outline: 'none', color: 'var(--text-dark)', fontFamily: 'inherit' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Descrição</label>
            <input type="text" defaultValue={product?.desc} placeholder="Descrição" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none', color: 'var(--text-dark)', fontFamily: 'inherit' }} />
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Preço</label>
              <input type="text" defaultValue={product?.price} placeholder="0,00" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none', color: 'var(--text-dark)', fontFamily: 'inherit' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Categoria</label>
              <input type="text" defaultValue={product?.category} placeholder="Ex: Pizzas" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none', color: 'var(--text-dark)', fontFamily: 'inherit' }} />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-dark)' }}>Foto</label>
            <div style={{ 
              border: '1px dashed var(--border)', 
              borderRadius: 12, 
              padding: 32, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 8,
              color: 'var(--text-light)',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-main)'
            }}>
              <ImageIcon size={24} />
              <span>Clique para enviar</span>
            </div>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8, padding: 12, fontSize: 14 }} onClick={() => onSave({})}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
