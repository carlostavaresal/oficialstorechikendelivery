
import { useEffect } from 'react';
import { useOrders } from './useOrders';
import { useCompanySettings } from './useCompanySettings';
import { useToast } from './use-toast';
import { useCustomerNotifications } from './useCustomerNotifications';

export const useWhatsAppIntegration = () => {
  const { orders } = useOrders();
  const { settings } = useCompanySettings();
  const { toast } = useToast();
  const { sendOrderConfirmation } = useCustomerNotifications();

  // Format WhatsApp number for proper linking
  const formatPhoneForWhatsApp = (phone: string) => {
    const numericOnly = phone.replace(/\D/g, "");
    if (numericOnly.length === 11 || numericOnly.length === 10) {
      return `55${numericOnly}`;
    }
    return numericOnly;
  };

  const sendOrderToWhatsApp = (order: any) => {
    if (!settings?.whatsapp_number) {
      console.log('WhatsApp Business number not configured');
      return;
    }

    const itemsList = order.items.map((item: any) => 
      `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `🍕 *NOVO PEDIDO* - ${order.order_number}

👤 *Cliente:* ${order.customer_name}
📞 *Telefone:* ${order.customer_phone}
📍 *Endereço:* ${order.customer_address}

📝 *Itens:*
${itemsList}

💰 *Total:* R$ ${order.total_amount.toFixed(2)}
💳 *Pagamento:* ${order.payment_method}
${order.notes ? `📋 *Observações:* ${order.notes}` : ''}

⏰ *Pedido realizado em:* ${new Date(order.created_at).toLocaleString('pt-BR')}

Por favor, confirme o recebimento deste pedido.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappBusinessNumber = formatPhoneForWhatsApp(settings.whatsapp_number);
    const whatsappUrl = `https://wa.me/${whatsappBusinessNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp Business automatically
    window.open(whatsappUrl, '_blank');
    
    // Send confirmation to customer
    setTimeout(() => {
      sendOrderConfirmation(order);
    }, 2000); // Wait 2 seconds before sending customer confirmation
    
    toast({
      title: "Pedido enviado para WhatsApp Business",
      description: `Pedido ${order.order_number} foi redirecionado automaticamente`,
    });
  };

  // Monitor new orders and automatically send to WhatsApp
  useEffect(() => {
    if (orders.length > 0) {
      const latestOrder = orders[0];
      // Check if it's a new pending order (created within last 30 seconds)
      const orderTime = new Date(latestOrder.created_at).getTime();
      const now = new Date().getTime();
      const timeDiff = now - orderTime;
      
      if (latestOrder.status === 'pending' && timeDiff < 30000) { // 30 seconds
        sendOrderToWhatsApp(latestOrder);
      }
    }
  }, [orders, settings]);

  return {
    sendOrderToWhatsApp
  };
};
