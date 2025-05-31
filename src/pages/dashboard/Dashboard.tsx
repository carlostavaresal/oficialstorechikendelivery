
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

const Dashboard: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
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

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle de delivery.
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
          value="0"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Entregues Hoje"
          value="0"
          icon={Package}
        />
        <StatsCard
          title="Tempo Médio"
          value="0 min"
          icon={Clock}
        />
        <StatsCard
          title="Entregadores Ativos"
          value="0"
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
