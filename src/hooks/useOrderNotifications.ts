import { useCompanySettings } from './useCompanySettings';
import { useToast } from './use-toast';
import { playNotificationSound, NOTIFICATION_SOUNDS } from '@/lib/soundUtils';
import type { Order } from './useOrders';

export const useOrderNotifications = () => {
  const { settings } = useCompanySettings();
  const { toast } = useToast();

  // Check if notifications are enabled from localStorage
  const isNotificationEnabled = (type: string) => {
    const setting = localStorage.getItem(`notification-${type}-enabled`);
    return setting === null || setting === 'true'; // Default to true
  };

  // Format WhatsApp number for proper linking
  const formatPhoneForWhatsApp = (phone: string) => {
    const numericOnly = phone.replace(/\D/g, "");
    if (numericOnly.length === 11 || numericOnly.length === 10) {
      return `55${numericOnly}`;
    }
    return numericOnly;
  };

  // Send order confirmation notification to customer
  const sendOrderConfirmation = (order: Order) => {
    if (!isNotificationEnabled('whatsapp') || !isNotificationEnabled('auto-confirm')) return;
    if (!order.customer_phone || !settings?.whatsapp_number) return;

    const itemsList = order.items.map((item: any) => 
      `${item.quantity}x ${item.name} - € ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `🍕 *CONFIRMAÇÃO DE PEDIDO* - ${order.order_number}

Olá ${order.customer_name}! 

✅ *Seu pedido foi RECEBIDO com sucesso!*

📝 *Itens confirmados:*
${itemsList}

💰 *Total:* € ${order.total_amount.toFixed(2)}
💳 *Forma de pagamento:* ${order.payment_method}
📍 *Endereço de entrega:* ${order.customer_address}
${order.notes ? `📋 *Observações:* ${order.notes}` : ''}

⏱️ *Tempo estimado:* 30-45 minutos
📞 *Contato:* ${settings.whatsapp_number}

Obrigado pela preferência! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const customerPhone = formatPhoneForWhatsApp(order.customer_phone);
    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Send delivery notification to customer
  const sendDeliveryNotification = (order: Order) => {
    if (!isNotificationEnabled('delivery') || !order.customer_phone || !settings?.whatsapp_number) return;

    const message = `🚚 *PEDIDO SAIU PARA ENTREGA* - ${order.order_number}

Olá ${order.customer_name}!

🛵 *Seu pedido está a caminho!*

📍 *Endereço de entrega:* ${order.customer_address}
⏱️ *Tempo estimado:* 15-20 minutos
💰 *Total a pagar:* € ${order.total_amount.toFixed(2)}
💳 *Forma de pagamento:* ${order.payment_method}

Aguarde nosso entregador! 📞 *Contato:* ${settings.whatsapp_number}

Obrigado pela preferência! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const customerPhone = formatPhoneForWhatsApp(order.customer_phone);
    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Send business notification about new order
  const sendBusinessNotification = (order: Order) => {
    if (!settings?.whatsapp_number) return;

    const itemsList = order.items.map((item: any) => 
      `${item.quantity}x ${item.name} - € ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `🔔 *NOVO PEDIDO RECEBIDO* - ${order.order_number}

👤 *Cliente:* ${order.customer_name}
📞 *Telefone:* ${order.customer_phone}
📍 *Endereço:* ${order.customer_address}

📝 *Itens:*
${itemsList}

💰 *Total:* € ${order.total_amount.toFixed(2)}
💳 *Pagamento:* ${order.payment_method}
${order.notes ? `📋 *Observações:* ${order.notes}` : ''}

⏰ *Horário do pedido:* ${new Date(order.created_at).toLocaleString('pt-BR')}

⚡ *AÇÃO NECESSÁRIA:* Confirmar recebimento do pedido`;

    const encodedMessage = encodeURIComponent(message);
    const businessPhone = formatPhoneForWhatsApp(settings.whatsapp_number);
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;
    
    // Auto-open business WhatsApp for new orders
    window.open(whatsappUrl, '_blank');
  };

  // Handle status change notifications
  const handleStatusChangeNotification = (order: Order, newStatus: string) => {
    let soundToPlay = NOTIFICATION_SOUNDS.ORDER_PROCESSING;
    let statusMessage = "em preparação";
    let toastTitle = "Status atualizado";
    
    switch (newStatus) {
      case "cancelled":
        soundToPlay = NOTIFICATION_SOUNDS.ORDER_CANCELLED;
        statusMessage = "cancelado";
        toastTitle = "Pedido Cancelado";
        break;
      case "delivered":
        soundToPlay = NOTIFICATION_SOUNDS.ORDER_DELIVERED;
        statusMessage = "entregue";
        toastTitle = "Pedido Entregue";
        break;
      case "processing":
        soundToPlay = NOTIFICATION_SOUNDS.ORDER_PROCESSING;
        statusMessage = "saiu para entrega";
        toastTitle = "Pedido Saiu para Entrega";
        // Send delivery notification when order status changes to processing
        sendDeliveryNotification(order);
        break;
      case "pending":
        soundToPlay = NOTIFICATION_SOUNDS.NEW_ORDER;
        statusMessage = "aguardando";
        toastTitle = "Novo Pedido Recebido";
        break;
    }
    
    // Play sound notification only if enabled
    if (isNotificationEnabled('sound')) {
      playNotificationSound(soundToPlay, 0.5);
    }
    
    // Show toast notification
    toast({
      title: toastTitle,
      description: `O pedido ${order.order_number} foi ${statusMessage}`,
    });
  };

  // Handle new order notification (called when order is first created)
  const handleNewOrderNotification = (order: Order) => {
    // Play new order sound only if enabled
    if (isNotificationEnabled('sound')) {
      playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER, 0.7);
    }
    
    // Show toast notification
    toast({
      title: "🔔 Novo Pedido Recebido!",
      description: `Pedido ${order.order_number} de ${order.customer_name}`,
      duration: 5000,
    });
    
    // Send confirmation to customer
    setTimeout(() => {
      sendOrderConfirmation(order);
    }, 1000);
    
    // Send notification to business
    setTimeout(() => {
      sendBusinessNotification(order);
    }, 2000);
  };

  return {
    sendOrderConfirmation,
    sendDeliveryNotification,
    sendBusinessNotification,
    handleStatusChangeNotification,
    handleNewOrderNotification
  };
};