import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import { Orders } from "./features/orders/Orders";
import { Products } from "./features/products/Products";
import { Dashboard } from "./features/dashboard/Dashboard";
import { Coupons } from "./features/coupons/Coupons";

export function App() {
  const [activePath, setActivePath] = useState("dashboard");

  return (
    <MainLayout activePath={activePath} onNavigate={setActivePath}>
      {activePath === "dashboard" && <Dashboard />}
      {activePath === "pedidos" && <Orders />}
      {activePath === "produtos" && <Products />}
      {activePath === "cupons" && <Coupons />}
    </MainLayout>
  );
}