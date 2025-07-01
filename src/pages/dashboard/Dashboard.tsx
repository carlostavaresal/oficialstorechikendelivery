import React, { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, Clock, Package, ShoppingCart, Truck, VolumeX, Volume2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import TopProducts from "@/components/dashboard/TopProducts";
import DeliveryMap from "@/components/dashboard/DeliveryMap";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NOTIFICATION_SOUNDS, playNotificationSound } from "@/lib/soundUtils";
import { useOrders } from "@/hooks/useOrders";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";

const Dashboard: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const { orders, loading } = useOrders();
  
  // Initialize WhatsApp integration
  useWhatsAppIntegration();
  
  // Set sound enabled/disabled preference in localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('dashboard-sound-enabled');
    if (savedPreference !== null) {
      setSoundEnabled(savedPreference === 'true');
    }
  }, []);
  
  // Save sound preference when it changes
  useEffect(() => {
    localStorage.setItem('dashboard-sound-enabled', soundEnabled.toString());
    // Override audio elements to respect sound preference
    const originalPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
      if (soundEnabled) {
        return originalPlay.call(this);
      }
      return Promise.resolve();
    };
    
    return () => {
      // Restore original play method when component unmounts
      HTMLAudioElement.prototype.play = originalPlay;
    };
  }, [soundEnabled]);
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // Play a test sound when enabling
    if (!soundEnabled) {
      setTimeout(() => {
        playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER, 0.3);
      }, 100);
    }
  };

  // Calculate stats from real orders
  const totalOrders = orders.length;
  const deliveredToday = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.created_at);
    return order.status === 'delivered' && 
           orderDate.toDateString() === today.toDateString();
  }).length;

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard - Tempo Real</h1>
          <p className="text-muted-foreground">
            Painel de controle com integração WhatsApp Business e atualizações em tempo real.
          </p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleSound}
                className="h-9 w-9"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{soundEnabled ? 'Desativar som' : 'Ativar som'} de notificações</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Pedidos"
          value={totalOrders.toString()}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Pedidos Pendentes"
          value={pendingOrders.toString()}
          icon={Clock}
          className={pendingOrders > 0 ? "border-yellow-400 bg-yellow-50" : ""}
        />
        <StatsCard
          title="Em Preparo"
          value={processingOrders.toString()}
          icon={Package}
          className={processingOrders > 0 ? "border-blue-400 bg-blue-50" : ""}
        />
        <StatsCard
          title="Entregues Hoje"
          value={deliveredToday.toString()}
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
