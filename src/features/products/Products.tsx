import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Package, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProductTable } from './components/ProductTable'
import { ProductFormModal } from './components/ProductFormModal'
import type { Product } from '../../data/mock'
import { api } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

export function Products() {
  const { user, restaurant } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (restaurant || user?.role !== 'RESTAURANT') {
      fetchProducts();
    }
  }, [restaurant, user]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const url = restaurant ? `/catalog?restaurantId=${restaurant.id}` : '/catalog';
      const data = await api.get(url);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = useMemo(() => ['Todas', ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]))], [products])

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

  const toggleAvailable = async (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
    
    try {
      await api.put(`/catalog/${id}`, { available: !product.available });
    } catch (error) {
      // Revert on error
      setProducts(prev => prev.map(p => p.id === id ? { ...p, available: product.available } : p));
      console.error('Failed to update product availability', error);
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return;
    try {
      await api.delete(`/catalog/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }
  const handleSave = async (data: FormData) => {
    try {
      if (restaurant) {
        data.append('restaurantId', restaurant.id.toString());
      }
      if (editingProduct) {
        await api.put(`/catalog/${editingProduct.id}`, data);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post('/catalog', data);
        toast.success('Produto criado com sucesso!');
      }
      handleCloseModal()
      fetchProducts()
    } catch (error) {
      console.error('Failed to save product', error);
      toast.error('Erro ao salvar produto');
    }
  }

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

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Loader2 className="spin text-primary" size={48} />
        </div>
      ) : (
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
          <ProductTable products={filtered} onEdit={handleEdit} onDelete={handleDelete} onToggleAvailable={toggleAvailable} />
        </div>
      )}

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
