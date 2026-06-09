import { Pencil, Trash2 } from 'lucide-react'
import type { Product } from '../../../data/mock'
import { formatBRL } from '../../../lib/format'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  onToggleAvailable: (id: number) => void
}

export function ProductTable({ products, onEdit, onDelete, onToggleAvailable }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Pencil size={24} /></div>
        <div className="empty-state-title">Nenhum produto encontrado</div>
        <div className="empty-state-text">Ajuste os filtros ou cadastre um novo produto.</div>
      </div>
    )
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Estoque</th>
          <th>Vendas 30d</th>
          <th>Preço</th>
          <th>Disponível</th>
          <th style={{ textAlign: 'right' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>
              <div className="product-info">
                <img src={product.image} alt={product.name} className="product-image" />
                <div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-desc">{product.description || product.desc}</div>
                </div>
              </div>
            </td>
            <td>
              {product.stock === 0 ? (
                <span className="pill pill-danger">Sem estoque</span>
              ) : product.stock < 10 ? (
                <span className="pill pill-warning">{product.stock} un</span>
              ) : (
                <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{product.stock} un</span>
              )}
            </td>
            <td><span className="text-dark fw-600">{product.sold30d}</span></td>
            <td style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{formatBRL(product.price)}</td>
            <td>
              <div
                className={`switch ${product.available ? 'on' : ''}`}
                onClick={() => onToggleAvailable(product.id)}
                role="switch"
                aria-checked={product.available}
              />
            </td>
            <td style={{ textAlign: 'right' }}>
              <button className="btn-icon" title="Editar" onClick={() => onEdit(product)}>
                <Pencil size={16} />
              </button>
              <button className="btn-icon" title="Remover" onClick={() => onDelete(product.id)}>
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
