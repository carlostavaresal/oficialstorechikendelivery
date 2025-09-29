import { useEffect, useRef } from 'react';
import { useOrders } from './useOrders';
import { useOrderNotifications } from './useOrderNotifications';

export const useWhatsAppIntegration = () => {
  const { orders } = useOrders();
  const { handleNewOrderNotification } = useOrderNotifications();
  const processedOrdersRef = useRef<Set<string>>(new Set());

  // Monitor new orders and automatically send notifications
  useEffect(() => {
    if (orders.length > 0) {
      // Get the latest order
      const latestOrder = orders[0];
      
      // Check if it's a new order that hasn't been processed yet
      if (!processedOrdersRef.current.has(latestOrder.id)) {
        // Check if it's a recent pending order (created within last 60 seconds)
        const orderTime = new Date(latestOrder.created_at).getTime();
        const now = new Date().getTime();
        const timeDiff = now - orderTime;
        
        if (latestOrder.status === 'pending' && timeDiff < 60000) { // 60 seconds
          console.log('Nova notificação de pedido:', latestOrder.order_number);
          handleNewOrderNotification(latestOrder);
          processedOrdersRef.current.add(latestOrder.id);
        }
      }
    }
  }, [orders, handleNewOrderNotification]);

  return {
    // Expose any additional methods if needed
  };
};