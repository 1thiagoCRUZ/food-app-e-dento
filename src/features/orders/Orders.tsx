import { useState, useEffect } from 'react'
import { Bell, ChefHat, Package, Bike, Filter, RefreshCcw, Loader2 } from 'lucide-react'
import { OrderCard } from './components/OrderCard'
import { OrderDrawer } from './components/OrderDrawer'
import { DriverVerifyModal } from './components/DriverVerifyModal'
import { api } from '../../lib/api'
import { drivers as initialDrivers, type Order, type OrderStatus } from '../../data/mock'
import { useAuth } from '../../contexts/AuthContext'

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { restaurant } = useAuth();
  const RESTAURANT_ID = restaurant?.id;

  const fetchOrders = async () => {
    if (!RESTAURANT_ID) return;
    try {
      // setIsLoading(true) -> Do not set loading true on every poll to avoid flicker
      const data = await api.get(`/orders/restaurant/${RESTAURANT_ID}`)
      // Map backend status to frontend status
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id.toString(),
        time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        placedAt: `Hoje, ${new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        customer: { 
          name: o.customerName || `Cliente ${o.userId}`, 
          phone: o.customerPhone || '(11) 99999-9999', 
          address: o.deliveryStreet ? `${o.deliveryStreet}, ${o.deliveryCity}` : 'Endereço não informado' 
        },
        items: o.items.map((i: any) => ({ name: i.name, q: i.quantity, price: parseFloat(i.price) })),
        subtotal: parseFloat(o.total),
        deliveryFee: 0,
        total: parseFloat(o.total),
        payment: o.paymentMethod === 'CREDIT_CARD' ? 'Cartão' : (o.paymentMethod || 'Pix'),
        paymentType: o.paymentMethod === 'PIX' ? 'pix' : 'card',
        paid: true,
        pickupCode: o.pickupVerificationCode || '1234',
        prepTimeMin: 30,
        status: mapStatus(o.status),
        driver: o.courierId ? {
          name: `Entregador #${o.courierId}`,
          initials: `MB`,
          vehicle: 'Moto',
          plate: '-',
          phone: '',
          rating: 5,
        } : undefined,
      }))
      setOrders(mappedOrders)
    } catch (error) {
      console.error('Failed to fetch orders', error)
    } finally {
      setIsLoading(false)
    }
  }

  const mapStatus = (status: string): OrderStatus => {
    if (status === 'AWAITING_PAYMENT' || status === 'NEW' || status === 'PAID') return 'new';
    if (status === 'PREPARING') return 'preparing';
    if (status === 'READY_FOR_PICKUP') return 'ready';
    if (status === 'OUT_FOR_DELIVERY' || status === 'IN_TRANSIT') return 'shipping';
    if (status === 'DELIVERED') return 'delivered';
    if (status === 'CANCELLED') return 'cancelled';
    return 'new';
  }

  useEffect(() => {
    fetchOrders()
    const intervalId = setInterval(fetchOrders, 10000); // 10s polling
    return () => clearInterval(intervalId);
  }, [RESTAURANT_ID])

  const moveOrder = async (id: string, newStatus: OrderStatus, patch?: Partial<Order>) => {
    // Optimistic update
    const previousOrders = [...orders];
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch, status: newStatus } : o))
    
    try {
      if (newStatus === 'preparing') {
        await api.patch(`/orders/${id}/confirm`, {});
      } else if (newStatus === 'ready') {
        await api.patch(`/orders/${id}/ready`, {});
      } else if (newStatus === 'cancelled') {
        await api.patch(`/orders/${id}/cancel`, {});
      }
      // Note: we don't have endpoints for new->new or ready->shipping.
      // Ready->shipping happens when driver uses PIN.
    } catch (e) {
      console.error('Failed to update status', e)
      setOrders(previousOrders);
    }
  }

  const onVerified = (orderId: string, driverId: string) => {
    const driver = initialDrivers.find(d => d.id === driverId)
    if (!driver) return
    moveOrder(orderId, 'shipping', {
      driver: {
        name: driver.name,
        initials: driver.initials,
        vehicle: driver.vehicle,
        plate: driver.plate,
        phone: driver.phone,
        rating: driver.rating,
      },
    })
    setVerifyingId(null)
    setSelectedId(null)
  }

  const selected = orders.find(o => o.id === selectedId) || null

  const columns: { key: OrderStatus; label: string; sub: string; icon: any; nextLabel: string; next: OrderStatus | null }[] = [
    { key: 'new', label: 'Novos pedidos', sub: 'Aguardando aceite', icon: Bell, nextLabel: 'Aceitar', next: 'preparing' },
    { key: 'preparing', label: 'Em preparo', sub: 'Cozinha em andamento', icon: ChefHat, nextLabel: 'Marcar pronto', next: 'ready' },
    { key: 'ready', label: 'Prontos para retirada', sub: 'Aguardando entregador', icon: Package, nextLabel: 'Verificar motoboy', next: null },
    { key: 'shipping', label: 'Em entrega', sub: 'Saiu com motoboy', icon: Bike, nextLabel: 'Em rota', next: null },
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão de pedidos</h1>
          <p className="page-subtitle">Acompanhe o fluxo da cozinha até a saída para entrega em tempo real.</p>
        </div>
        <div className="flex gap-8 items-center">
          <button className="btn btn-outline" onClick={fetchOrders} disabled={isLoading}>
            <RefreshCcw size={16} className={isLoading ? 'spin' : ''} /> Atualizar
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Loader2 className="spin text-primary" size={48} />
        </div>
      ) : (
        <div className="kanban-board">
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.key)
          return (
            <div key={col.key} className="kanban-column">
              <div className="kanban-column-header">
                <div className="kanban-column-icon"><col.icon size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div className="kanban-column-title">{col.label}</div>
                  <div className="kanban-column-sub">{col.sub}</div>
                </div>
                <div className="kanban-column-count">{colOrders.length}</div>
              </div>

              {colOrders.length === 0 ? (
                <div className="card card-pad text-center text-sm text-muted" style={{ borderStyle: 'dashed' }}>
                  Nenhum pedido aqui
                </div>
              ) : (
                colOrders.map(o => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    actionLabel={col.nextLabel}
                    nextStatus={col.next}
                    onOpen={() => setSelectedId(o.id)}
                    onAction={() => {
                      if (col.key === 'ready') {
                        setVerifyingId(o.id)
                      } else if (col.next) {
                        moveOrder(o.id, col.next)
                      }
                    }}
                  />
                ))
              )}
            </div>
          )
        })}
      </div>
      )}

      {selected && (
        <OrderDrawer
          order={selected}
          onClose={() => setSelectedId(null)}
          onAdvance={() => {
            if (selected.status === 'new') moveOrder(selected.id, 'preparing')
            else if (selected.status === 'preparing') moveOrder(selected.id, 'ready')
            else if (selected.status === 'ready') setVerifyingId(selected.id)
          }}
          onCancel={() => setSelectedId(null)}
        />
      )}

      {verifyingId && (
        <DriverVerifyModal
          order={orders.find(o => o.id === verifyingId)!}
          drivers={initialDrivers}
          onClose={() => setVerifyingId(null)}
          onVerified={(driverId) => onVerified(verifyingId, driverId)}
        />
      )}
    </>
  )
}
