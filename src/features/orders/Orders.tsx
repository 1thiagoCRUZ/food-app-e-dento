import { useState, useEffect } from 'react'
import { Bell, ChefHat, Package, Bike, Filter, RefreshCcw } from 'lucide-react'
import { OrderCard } from './components/OrderCard'
import { OrderDrawer } from './components/OrderDrawer'
import { DriverVerifyModal } from './components/DriverVerifyModal'
import { api } from '../../lib/api'
import { drivers as initialDrivers, type Order, type OrderStatus } from '../../data/mock'

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const RESTAURANT_ID = 1;

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await api.get(`/orders/restaurant/${RESTAURANT_ID}`)
      // Map backend status to frontend status
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id.toString(),
        time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        placedAt: `Hoje, ${new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        customer: { name: `Cliente ${o.userId}`, phone: '(11) 99999-9999', address: 'Endereço não informado' },
        items: o.items.map((i: any) => ({ name: i.name, q: i.quantity, price: parseFloat(i.price) })),
        subtotal: parseFloat(o.total),
        deliveryFee: 0,
        total: parseFloat(o.total),
        payment: 'Cartão / Pix',
        paymentType: 'pix',
        paid: true,
        pickupCode: o.pickupVerificationCode || '1234',
        prepTimeMin: 30,
        status: mapStatus(o.status),
      }))
      setOrders(mappedOrders)
    } catch (error) {
      console.error('Failed to fetch orders', error)
    } finally {
      setIsLoading(false)
    }
  }

  const mapStatus = (status: string): OrderStatus => {
    if (status === 'AWAITING_PAYMENT' || status === 'NEW') return 'new';
    if (status === 'PREPARING') return 'preparing';
    if (status === 'READY_FOR_PICKUP') return 'ready';
    if (status === 'OUT_FOR_DELIVERY') return 'shipping';
    if (status === 'DELIVERED') return 'delivered';
    if (status === 'CANCELLED') return 'cancelled';
    return 'new';
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const moveOrder = async (id: string, newStatus: OrderStatus, patch?: Partial<Order>) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch, status: newStatus } : o))
    
    // Reverse map for backend
    let backendStatus = 'NEW';
    if (newStatus === 'new') backendStatus = 'NEW';
    if (newStatus === 'preparing') backendStatus = 'PREPARING';
    if (newStatus === 'ready') backendStatus = 'READY_FOR_PICKUP';
    if (newStatus === 'shipping') backendStatus = 'OUT_FOR_DELIVERY';

    try {
      // Assuming a patch endpoint for order status exists or will exist
      // await api.patch(`/orders/${id}/status`, { status: backendStatus })
    } catch (e) {
      console.error('Failed to update status', e)
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
