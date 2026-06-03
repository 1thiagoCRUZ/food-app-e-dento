import { X, Image as ImageIcon } from 'lucide-react'
import type { Product } from '../../../data/mock'

interface ProductFormModalProps {
  onClose: () => void
  onSave: (data: any) => void
  product?: Product | null
}

export function ProductFormModal({ onClose, onSave, product }: ProductFormModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{product ? 'Editar produto' : 'Novo produto'}</div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Nome do produto</label>
            <input className="input" defaultValue={product?.name} placeholder="Ex: Pizza Margherita" />
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea className="textarea" defaultValue={product?.desc} placeholder="Ingredientes, modo de preparo, observações…" />
          </div>

          <div className="row">
            <div className="field">
              <label>Categoria</label>
              <select className="select" defaultValue={product?.category || 'Pizzas'}>
                <option>Pizzas</option>
                <option>Hambúrgueres</option>
                <option>Japonesa</option>
                <option>Bebidas</option>
                <option>Sobremesas</option>
              </select>
            </div>
            <div className="field">
              <label>Preço (R$)</label>
              <input className="input" defaultValue={product?.price?.toFixed(2).replace('.', ',')} placeholder="0,00" />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Estoque inicial</label>
              <input className="input" type="number" defaultValue={product?.stock ?? 0} placeholder="0" />
              <div className="field-hint">Quantidade disponível para venda</div>
            </div>
            <div className="field">
              <label>Tempo de preparo</label>
              <input className="input" placeholder="Ex: 20 min" />
            </div>
          </div>

          <div className="field">
            <label>Foto do produto</label>
            <div className="upload-box">
              <ImageIcon size={28} />
              <span className="text-md fw-600">Clique para enviar</span>
              <span className="text-xs">PNG ou JPG · até 2MB</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onSave({})}>
            {product ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
        </div>
      </div>
    </div>
  )
}
