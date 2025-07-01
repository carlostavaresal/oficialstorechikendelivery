
import { useCompanySettings } from './useCompanySettings';

export const useCustomerNotifications = () => {
  const { settings } = useCompanySettings();

  const formatPhoneForWhatsApp = (phone: string) => {
    const numericOnly = phone.replace(/\D/g, "");
    if (numericOnly.length === 11 || numericOnly.length === 10) {
      return `55${numericOnly}`;
    }
    return numericOnly;
  };

  const sendOrderConfirmation = (order: any) => {
    if (!order.customer_phone) return;

    const itemsList = order.items.map((item: any) => 
      `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `✅ *PEDIDO CONFIRMADO* - ${order.order_number}

Olá ${order.customer_name}! Seu pedido foi confirmado com sucesso.

📋 *Resumo do Pedido:*
${itemsList}

💰 *Total:* R$ ${order.total_amount.toFixed(2)}
💳 *Pagamento:* ${order.payment_method}

📍 *Endereço de Entrega:*
${order.customer_address}

${order.notes ? `📝 *Observações:* ${order.notes}` : ''}

⏰ *Tempo estimado:* 30-45 minutos

Obrigado pela preferência! 🍕`;

    const encodedMessage = encodeURIComponent(message);
    const customerPhone = formatPhoneForWhatsApp(order.customer_phone);
    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp to send confirmation
    window.open(whatsappUrl, '_blank');
  };

  const sendDeliveryNotification = (order: any) => {
    if (!order.customer_phone) return;

    const message = `🚚 *PEDIDO SAIU PARA ENTREGA* - ${order.order_number}

Olá ${order.customer_name}!

Seu pedido saiu para entrega e chegará em breve! 🎉

📋 *Pedido:* ${order.order_number}
📍 *Endereço:* ${order.customer_address}
💰 *Total:* R$ ${order.total_amount.toFixed(2)}

⏰ *Previsão de chegada:* 15-20 minutos

Prepare o pagamento e aguarde nosso entregador! 
Obrigado pela preferência! 🍕`;

    const encodedMessage = encodeURIComponent(message);
    const customerPhone = formatPhoneForWhatsApp(order.customer_phone);
    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp to send delivery notification
    window.open(whatsappUrl, '_blank');
  };

  return {
    sendOrderConfirmation,
    sendDeliveryNotification
  };
};
