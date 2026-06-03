import { useState, useMemo } from 'react'
import { Plus, Search, Package, TrendingUp, AlertTriangle } from 'lucide-react'
import { ProductTable } from './components/ProductTable'
import { ProductFormModal } from './components/ProductFormModal'
import { products as initialProducts, type Product } from '../../data/mock'

export function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')

  const categories = useMemo(() => ['Todas', ...Array.from(new Set(products.map(p => p.category)))], [products])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (category !== 'Todas' && p.category !== category) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [products, search, category])

  const totalProducts = products.length
  const availableProducts = products.filter(p => p.available).length
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length
  const outOfStock = products.filter(p => p.stock === 0).length

  const toggleAvailable = (id: number) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p))

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }
  const handleSave = () => handleCloseModal()

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Produtos</h1>
          <p className="page-subtitle">Gerencie o catálogo, estoque e disponibilidade dos seus pratos.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Novo produto
        </button>
      </div>

      <div className="stat-grid">
        <SummaryCard label="Total" value={totalProducts} icon={Package} />
        <SummaryCard label="Disponíveis" value={availableProducts} icon={TrendingUp} delta={`${Math.round((availableProducts/totalProducts)*100)}% do catálogo`} />
        <SummaryCard label="Estoque baixo" value={lowStock} icon={AlertTriangle} warning={lowStock > 0} />
        <SummaryCard label="Sem estoque" value={outOfStock} icon={AlertTriangle} warning={outOfStock > 0} />
      </div>

      <div className="data-table-container">
        <div className="table-toolbar">
          <div className="search-box" style={{ minWidth: 0, flex: 1, maxWidth: 360 }}>
            <Search size={14} color="var(--text-light)" />
            <input
              placeholder="Buscar produto…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-8">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`pill ${category === c ? 'pill-primary' : 'pill-neutral'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <ProductTable products={filtered} onEdit={handleEdit} onToggleAvailable={toggleAvailable} />
      </div>

      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  )
}

function SummaryCard({ label, value, icon: Icon, delta, warning }: { label: string; value: number; icon: any; delta?: string; warning?: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-card-head">
        <span className="stat-label">{label}</span>
        <div className="stat-icon" style={warning ? { background: 'var(--warning-light)', color: 'var(--warning)' } : undefined}>
          <Icon size={18} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {delta && <div className="stat-delta">{delta}</div>}
    </div>
  )
}
