import { useState } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'
import type { Product } from '../../../data/mock'

interface ProductFormModalProps {
  onClose: () => void
  onSave: (data: any) => void
  product?: Product | null
}

export function ProductFormModal({ onClose, onSave, product }: ProductFormModalProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(product?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      description: formData.get('description'),
      price: parseFloat((formData.get('price') as string).replace(',', '.')),
      stock: parseInt(formData.get('stock') as string, 10),
      image: imageBase64,
    };
    onSave(data);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="modal-header">
          <div className="modal-title">{product ? 'Editar produto' : 'Novo produto'}</div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Nome do produto</label>
            <input className="input" name="name" defaultValue={product?.name} placeholder="Ex: Pizza Margherita" required />
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea className="textarea" name="description" defaultValue={product?.desc} placeholder="Ingredientes, modo de preparo, observações…" />
          </div>

          <div className="row">
            <div className="field">
              <label>Preço (R$)</label>
              <input className="input" name="price" defaultValue={product?.price ? Number(product.price).toFixed(2).replace('.', ',') : ''} placeholder="0,00" required />
            </div>
            <div className="field">
              <label>Estoque inicial</label>
              <input className="input" name="stock" type="number" defaultValue={product?.stock ?? 0} placeholder="0" />
              <div className="field-hint">Quantidade disponível para venda</div>
            </div>
          </div>

          <div className="field">
            <label>Foto do produto</label>
            <label className="upload-box" style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
              <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
              {imageBase64 ? (
                <img src={imageBase64} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
              ) : (
                <>
                  <ImageIcon size={28} />
                  <span className="text-md fw-600">Clique para enviar</span>
                  <span className="text-xs">PNG ou JPG · até 2MB</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary">
            {product ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
        </div>
      </form>
    </div>
  )
}
