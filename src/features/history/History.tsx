import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { api } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import type { Order } from '../../data/mock'

export function History() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { restaurant } = useAuth()
  const RESTAURANT_ID = restaurant?.id

  const fetchHistory = async () => {
    if (!RESTAURANT_ID) return
    try {
      setIsLoading(true)
      const data = await api.get(`/orders/restaurant/${RESTAURANT_ID}`)
      // Filter only delivered and cancelled
      const filtered = data.filter((o: any) => o.status === 'DELIVERED' || o.status === 'CANCELLED')
      
      const mappedOrders: Order[] = filtered.map((o: any) => ({
        id: o.id.toString(),
        customer: { name: o.customerName || `Cliente ${o.userId}`, phone: o.customerPhone || '(11) 99999-9999' },
        items: o.items.map((i: any) => ({ name: i.name, quantity: i.quantity, price: parseFloat(i.price) })),
        total: parseFloat(o.total),
        status: o.status === 'DELIVERED' ? 'delivered' : 'cancelled',
        placedAt: new Date(o.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: o.paymentMethod || 'Dinheiro',
        paymentStatus: 'paid',
        deliveryAddress: {
          street: o.deliveryStreet || 'Rua Principal, 123',
          neighborhood: 'Bairro',
          city: o.deliveryCity || 'Cidade',
          number: '123',
        },
        pickupCode: o.pickupVerificationCode || '1234',
        prepTimeMin: 30,
      }))
      setOrders(mappedOrders)
    } catch (error) {
      console.error('Failed to fetch history', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [RESTAURANT_ID])

  const filteredOrders = orders.filter(o => {
    if (search && !o.id.includes(search) && !o.customer.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Histórico de Pedidos</h1>
          <p className="page-subtitle">Consulte os pedidos entregues e cancelados da sua loja.</p>
        </div>
      </div>

      <div className="data-table-container">
        <div className="table-toolbar">
          <div className="search-box" style={{ minWidth: 0, flex: 1, maxWidth: 360 }}>
            <Search size={14} color="var(--text-light)" />
            <input
              placeholder="Buscar por # do pedido ou cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Loader2 className="spin text-primary" size={32} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">Nenhum pedido no histórico</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Pedido</th>
                <th style={{ width: '120px' }}>Data/Hora</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>#{o.id}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{o.placedAt}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{o.customer.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{o.customer.phone}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {o.items.map((i, idx) => (
                        <div key={idx} style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{i.quantity}x</span> {i.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`pill ${o.status === 'delivered' ? 'pill-success' : 'pill-danger'}`}>
                      {o.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-dark)' }}>
                    R$ {o.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
