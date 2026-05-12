import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProductTable } from './components/ProductTable';
import { ProductFormModal } from './components/ProductFormModal';

export function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Pizza Margherita',
      desc: 'Molho de tomate, mussarela fresca, manjericão e azeite extra virgem.',
      category: 'Pizzas',
      price: 'R$ 39.90',
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Pizza Calabresa',
      desc: 'Calabresa fatiada, cebola roxa, azeitonas e orégano.',
      category: 'Pizzas',
      price: 'R$ 42.90',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Smash Burger Duplo',
      desc: 'Dois smash de blend bovino, cheddar, alface, tomate e molho especial.',
      category: 'Hambúrgueres',
      price: 'R$ 32.90',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop'
    },
    {
      id: 4,
      name: 'Combo Sushi 20 peças',
      desc: '10 hot rolls, 5 uramaki e 5 niguiris variados.',
      category: 'Japonesa',
      price: 'R$ 69.90',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop'
    },
    {
      id: 5,
      name: 'Brownie com Sorvete',
      desc: 'Brownie de chocolate belga com sorvete de baunilha e calda quente.',
      category: 'Sobremesas',
      price: 'R$ 22.90',
      image: 'https://images.unsplash.com/photo-1564353009664-de5a49479e0f?w=100&h=100&fit=crop'
    }
  ]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = (data: any) => {
    console.log('Salvando produto:', data);
    handleCloseModal();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Produtos</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      <ProductTable products={products} onEdit={handleEdit} />

      {isModalOpen && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={handleCloseModal} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}
