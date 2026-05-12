import { useState } from 'react';
import { Bell, ChefHat, Package } from 'lucide-react';
import { OrderCard, Order, OrderStatus } from './components/OrderCard';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001', time: '14:32', customer: 'Ana Silva', address: 'Rua das Flores, 123 - Centro\n(11) 98765-4321',
      items: [{ q: 2, name: 'Pizza Margherita G' }, { q: 1, name: 'Coca-Cola 2L' }],
      payment: 'Pix', total: 'R$ 92.70', status: 'new'
    },
    {
      id: 'ORD-002', time: '14:28', customer: 'Carlos Souza', address: 'Av. Paulista, 1500 - Bela Vista',
      items: [{ q: 1, name: 'Smash Burger Duplo' }],
      payment: 'Cartão Crédito', total: 'R$ 45.50', status: 'new'
    },
    {
      id: 'ORD-003', time: '14:15', customer: 'Maria Santos', address: 'Rua Oscar Freire, 200 - Jardins',
      items: [{ q: 1, name: 'Combo Sushi 20 peças' }, { q: 1, name: 'Hot Roll 8un' }],
      payment: 'Cartão Débito', total: 'R$ 109.80', status: 'preparing'
    },
    {
      id: 'ORD-005', time: '13:50', customer: 'Fernanda Costa', address: 'Alameda Santos, 700 - Cerqueira',
      items: [{ q: 3, name: 'Brownie com Sorvete' }],
      payment: 'Cartão Crédito', total: 'R$ 68.70', status: 'ready'
    }
  ]);

  const moveOrder = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão de Pedidos</h1>
          <p className="product-desc">Acompanhe e mova os pedidos pelo fluxo da cozinha em tempo real.</p>
        </div>
      </div>
      
      <div className="kanban-board">
        {/* Coluna 1: Novos Pedidos */}
        <div className="kanban-column">
          <div className="kanban-column-header">
            <div className="kanban-column-icon" style={{color: 'var(--primary)', backgroundColor: 'var(--primary-light)'}}>
              <Bell size={20} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, color: 'var(--text-dark)'}}>Novos pedidos</div>
              <div style={{fontSize: 12, color: 'var(--text-light)'}}>{orders.filter(o => o.status === 'new').length} pedidos</div>
            </div>
            <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)'}}></div>
          </div>
          {orders.filter(o => o.status === 'new').map(o => (
            <OrderCard key={o.id} order={o} actionLabel="Aceitar" nextStatus="preparing" onMoveOrder={moveOrder} />
          ))}
        </div>

        {/* Coluna 2: Em preparo */}
        <div className="kanban-column">
          <div className="kanban-column-header">
            <div className="kanban-column-icon" style={{color: '#3B82F6', backgroundColor: '#EFF6FF'}}>
              <ChefHat size={20} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, color: 'var(--text-dark)'}}>Em preparo</div>
              <div style={{fontSize: 12, color: 'var(--text-light)'}}>{orders.filter(o => o.status === 'preparing').length} pedidos</div>
            </div>
            <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6'}}></div>
          </div>
          {orders.filter(o => o.status === 'preparing').map(o => (
            <OrderCard key={o.id} order={o} actionLabel="Despachar" nextStatus="ready" onMoveOrder={moveOrder} />
          ))}
        </div>

        {/* Coluna 3: Prontos para retirada */}
        <div className="kanban-column">
          <div className="kanban-column-header">
            <div className="kanban-column-icon" style={{color: 'var(--success)', backgroundColor: 'var(--success-light)'}}>
              <Package size={20} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, color: 'var(--text-dark)'}}>Prontos para retirada</div>
              <div style={{fontSize: 12, color: 'var(--text-light)'}}>{orders.filter(o => o.status === 'ready').length} pedidos</div>
            </div>
            <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)'}}></div>
          </div>
          {orders.filter(o => o.status === 'ready').map(o => (
            <OrderCard key={o.id} order={o} actionLabel="Aguardando entregador" onMoveOrder={moveOrder} />
          ))}
        </div>
      </div>
    </div>
  );
}
