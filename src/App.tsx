import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import { Dashboard } from './features/dashboard/Dashboard'
import { Orders } from './features/orders/Orders'
import { Products } from './features/products/Products'
import { Coupons } from './features/coupons/Coupons'
import { Drivers } from './features/drivers/Drivers'
import { Settings } from './features/settings/Settings'
import { Login } from './features/auth/Login'
import { useAuth } from './contexts/AuthContext'

export function App() {
  const [activePath, setActivePath] = useState('pedidos')
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null // Or a simple spinner
  }

  if (!user) {
    return <Login />
  }

  return (
    <>
      <Toaster position="top-right" />
      <MainLayout activePath={activePath} onNavigate={setActivePath}>
        {activePath === 'dashboard' && <Dashboard onNavigate={setActivePath} />}
        {activePath === 'pedidos' && <Orders />}
        {activePath === 'entregadores' && <Drivers />}
        {activePath === 'produtos' && <Products />}
        {activePath === 'cupons' && <Coupons />}
        {activePath === 'configuracoes' && <Settings />}
      </MainLayout>
    </>
  )
}
