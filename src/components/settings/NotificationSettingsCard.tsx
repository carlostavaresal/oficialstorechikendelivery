import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, MessageCircle, Bell, TestTube } from 'lucide-react';
import { playNotificationSound, NOTIFICATION_SOUNDS } from '@/lib/soundUtils';
import { useToast } from '@/hooks/use-toast';

export const NotificationSettingsCard = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [autoConfirmOrders, setAutoConfirmOrders] = useState(true);
  const [deliveryNotifications, setDeliveryNotifications] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSoundEnabled = localStorage.getItem('notification-sound-enabled');
    const savedWhatsappEnabled = localStorage.getItem('notification-whatsapp-enabled');
    const savedAutoConfirm = localStorage.getItem('notification-auto-confirm');
    const savedDeliveryNotifications = localStorage.getItem('notification-delivery-enabled');

    if (savedSoundEnabled !== null) setSoundEnabled(savedSoundEnabled === 'true');
    if (savedWhatsappEnabled !== null) setWhatsappEnabled(savedWhatsappEnabled === 'true');
    if (savedAutoConfirm !== null) setAutoConfirmOrders(savedAutoConfirm === 'true');
    if (savedDeliveryNotifications !== null) setDeliveryNotifications(savedDeliveryNotifications === 'true');
  }, []);

  const handleSoundEnabledChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('notification-sound-enabled', enabled.toString());
    
    if (enabled) {
      // Test sound when enabling
      setTimeout(() => {
        playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER, 0.3);
      }, 100);
    }

    toast({
      title: enabled ? "Sons ativados" : "Sons desativados",
      description: enabled ? "Notificações sonoras estão ativas" : "Notificações sonoras foram desativadas"
    });
  };

  const handleWhatsappEnabledChange = (enabled: boolean) => {
    setWhatsappEnabled(enabled);
    localStorage.setItem('notification-whatsapp-enabled', enabled.toString());
    
    toast({
      title: enabled ? "WhatsApp ativado" : "WhatsApp desativado",
      description: enabled ? "Notificações via WhatsApp estão ativas" : "Notificações via WhatsApp foram desativadas"
    });
  };

  const handleAutoConfirmChange = (enabled: boolean) => {
    setAutoConfirmOrders(enabled);
    localStorage.setItem('notification-auto-confirm', enabled.toString());
    
    toast({
      title: enabled ? "Auto-confirmação ativada" : "Auto-confirmação desativada",
      description: enabled ? "Pedidos serão confirmados automaticamente" : "Confirmação manual necessária"
    });
  };

  const handleDeliveryNotificationsChange = (enabled: boolean) => {
    setDeliveryNotifications(enabled);
    localStorage.setItem('notification-delivery-enabled', enabled.toString());
    
    toast({
      title: enabled ? "Notificações de entrega ativadas" : "Notificações de entrega desativadas",
      description: enabled ? "Clientes receberão notificações quando pedidos saírem para entrega" : "Notificações de entrega desativadas"
    });
  };

  const testNotifications = () => {
    // Test sound
    if (soundEnabled) {
      playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER, 0.5);
    }

    // Test toast
    toast({
      title: "🔔 Teste de Notificação",
      description: "Sistema de notificações funcionando corretamente!",
      duration: 3000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Notificações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sound Notifications */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            {soundEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
            <div>
              <Label htmlFor="sound-notifications" className="text-base font-medium">
                Notificações Sonoras
              </Label>
              <p className="text-sm text-muted-foreground">
                Reproduzir sons quando receber novos pedidos
              </p>
            </div>
          </div>
          <Switch
            id="sound-notifications"
            checked={soundEnabled}
            onCheckedChange={handleSoundEnabledChange}
          />
        </div>

        {/* WhatsApp Notifications */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <MessageCircle className={`h-5 w-5 ${whatsappEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
            <div>
              <Label htmlFor="whatsapp-notifications" className="text-base font-medium">
                Notificações WhatsApp
              </Label>
              <p className="text-sm text-muted-foreground">
                Enviar confirmações automáticas para clientes
              </p>
            </div>
          </div>
          <Switch
            id="whatsapp-notifications"
            checked={whatsappEnabled}
            onCheckedChange={handleWhatsappEnabledChange}
          />
        </div>

        {/* Auto-confirm Orders */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className={`h-5 w-5 ${autoConfirmOrders ? 'text-blue-600' : 'text-muted-foreground'}`} />
            <div>
              <Label htmlFor="auto-confirm" className="text-base font-medium">
                Confirmação Automática
              </Label>
              <p className="text-sm text-muted-foreground">
                Enviar confirmação imediata quando pedido for recebido
              </p>
            </div>
          </div>
          <Switch
            id="auto-confirm"
            checked={autoConfirmOrders}
            onCheckedChange={handleAutoConfirmChange}
          />
        </div>

        {/* Delivery Notifications */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <MessageCircle className={`h-5 w-5 ${deliveryNotifications ? 'text-orange-600' : 'text-muted-foreground'}`} />
            <div>
              <Label htmlFor="delivery-notifications" className="text-base font-medium">
                Notificações de Entrega
              </Label>
              <p className="text-sm text-muted-foreground">
                Avisar clientes quando pedido sair para entrega
              </p>
            </div>
          </div>
          <Switch
            id="delivery-notifications"
            checked={deliveryNotifications}
            onCheckedChange={handleDeliveryNotificationsChange}
          />
        </div>

        {/* Test Notifications Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={testNotifications} 
            variant="outline" 
            className="w-full"
            disabled={!soundEnabled}
          >
            <TestTube className="h-4 w-4 mr-2" />
            Testar Notificações
          </Button>
        </div>

        {/* Status Summary */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <strong>Status atual:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Sons: {soundEnabled ? 'Ativados' : 'Desativados'}</li>
            <li>• WhatsApp: {whatsappEnabled ? 'Ativado' : 'Desativado'}</li>
            <li>• Auto-confirmação: {autoConfirmOrders ? 'Ativada' : 'Desativada'}</li>
            <li>• Notificações de entrega: {deliveryNotifications ? 'Ativadas' : 'Desativadas'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};