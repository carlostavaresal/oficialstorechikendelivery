
import React from "react";
import { ArrowDown, ArrowUp, Clock, Package, ShoppingCart, Truck } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import TopProducts from "@/components/dashboard/TopProducts";
import DeliveryMap from "@/components/dashboard/DeliveryMap";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle de delivery.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Pedidos"
          value="284"
          icon={ShoppingCart}
          change={{ value: "12%", positive: true }}
        />
        <StatsCard
          title="Entregues Hoje"
          value="38"
          icon={Package}
          change={{ value: "8%", positive: true }}
        />
        <StatsCard
          title="Tempo Médio"
          value="32 min"
          icon={Clock}
          change={{ value: "5%", positive: false }}
        />
        <StatsCard
          title="Entregadores Ativos"
          value="12"
          icon={Truck}
        />
      </div>

      <div className="mt-6">
        <RecentOrders />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <DeliveryMap />
        <TopProducts />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
