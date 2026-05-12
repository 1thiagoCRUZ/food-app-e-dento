import { Clock, User, MapPin, Printer, Package, ArrowRight } from 'lucide-react';

export type OrderStatus = 'new' | 'preparing' | 'ready';

export interface Order {
  id: string;
  time: string;
  customer: string;
  address: string;
  items: { q: number; name: string }[];
  payment: string;
  total: string;
  status: OrderStatus;
}

interface OrderCardProps {
  order: Order;
  actionLabel: string;
  nextStatus?: OrderStatus;
  onMoveOrder: (id: string, newStatus: OrderStatus) => void;
}

export function OrderCard({ order, actionLabel, nextStatus, onMoveOrder }: OrderCardProps) {
  return (
    <div className="kanban-card">
      <div className="kanban-card-header">
        <span className="kanban-card-id" style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <div style={{border: '1px solid var(--border)', borderRadius: 4, padding: 2}}><Package size={12} /></div>
          {order.id}
        </span>
        <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Clock size={14}/> {order.time}</span>
      </div>
      
      <div>
        <div className="kanban-customer">
          <User size={16} style={{color: 'var(--text-light)'}} />
          {order.customer}
        </div>
        <div className="kanban-address" style={{marginTop: 4, whiteSpace: 'pre-line'}}>
          <MapPin size={16} style={{flexShrink: 0, marginTop: 2, color: 'var(--text-light)'}} />
          <span>{order.address}</span>
        </div>
      </div>
      
      <div className="kanban-items">
        {order.items.map((item, idx) => (
          <div key={idx} className="kanban-item">
            <span><span className="kanban-item-quantity">{item.q}x</span>{item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="kanban-footer">
        <span style={{color: 'var(--text-light)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4}}>
          <div style={{width: 14, height: 10, border: '1px solid var(--text-light)', borderRadius: 2}}></div>
          {order.payment}
        </span>
        <span className="kanban-price">{order.total}</span>
      </div>
      
      <div className="kanban-actions">
        <button className="btn btn-outline" style={{padding: '8px', flex: '0 0 auto'}}>
          <Printer size={16} />
        </button>
        {nextStatus ? (
          <button className="btn btn-primary" onClick={() => onMoveOrder(order.id, nextStatus)}>
            {actionLabel} <ArrowRight size={16} />
          </button>
        ) : (
          <button className="btn btn-outline" style={{color: 'var(--text-light)', fontWeight: 500}} disabled>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
