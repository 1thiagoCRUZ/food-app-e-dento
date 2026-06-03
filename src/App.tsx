import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import { Dashboard } from './features/dashboard/Dashboard'
import { Orders } from './features/orders/Orders'
import { Products } from './features/products/Products'
import { Coupons } from './features/coupons/Coupons'
import { Drivers } from './features/drivers/Drivers'
import { Settings } from './features/settings/Settings'

export function App() {
  const [activePath, setActivePath] = useState('pedidos')

  return (
    <MainLayout activePath={activePath} onNavigate={setActivePath}>
      {activePath === 'dashboard' && <Dashboard onNavigate={setActivePath} />}
      {activePath === 'pedidos' && <Orders />}
      {activePath === 'entregadores' && <Drivers />}
      {activePath === 'produtos' && <Products />}
      {activePath === 'cupons' && <Coupons />}
      {activePath === 'configuracoes' && <Settings />}
    </MainLayout>
  )
}
