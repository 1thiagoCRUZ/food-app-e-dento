import { Pencil } from 'lucide-react';

interface ProductTableProps {
  products: any[];
  onEdit: (product: any) => void;
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th style={{textAlign: 'right'}}>Ações</th>
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
                    <div className="product-desc">{product.desc}</div>
                  </div>
                </div>
              </td>
              <td>{product.category}</td>
              <td style={{fontWeight: 500, color: 'var(--text-dark)'}}>{product.price}</td>
              <td style={{textAlign: 'right'}}>
                <button className="btn-icon" title="Editar" onClick={() => onEdit(product)}>
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
