import { useState } from 'react'
import { Bell, ChefHat, Package, Bike, Filter, RefreshCcw } from 'lucide-react'
import { OrderCard } from './components/OrderCard'
import { OrderDrawer } from './components/OrderDrawer'
import { DriverVerifyModal } from './components/DriverVerifyModal'
import { orders as initialOrders, drivers as initialDrivers, type Order, type OrderStatus } from '../../data/mock'

export function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const moveOrder = (id: string, newStatus: OrderStatus, patch?: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch, status: newStatus } : o))
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
          <button className="btn btn-outline">
            <Filter size={16} /> Filtros
          </button>
          <button className="btn btn-outline">
            <RefreshCcw size={16} /> Atualizar
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
