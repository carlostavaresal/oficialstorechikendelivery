
import { PaymentMethod } from "@/components/payment/PaymentMethodSelector";

interface Order {
  id: string;
  customer: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: string;
  date: Date;
  items: number;
  phone?: string;
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  address?: string;
  paymentMethod?: PaymentMethod;
}

const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case "cash": return "Dinheiro";
    case "pix": return "Pix";
    case "credit": return "Cartão de Crédito";
    default: return "Desconhecido";
  }
};

export const printOrder = (order: Order, copies: number = 1) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }

  const orderItems = order.orderItems || [];
  const paymentLabel = order.paymentMethod ? getPaymentMethodLabel(order.paymentMethod) : "Não informado";

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pedido ${order.id}</title>
      <style>
        @media print {
          body { margin: 0; font-family: monospace; font-size: 12px; }
          .page-break { page-break-after: always; }
        }
        body { font-family: monospace; font-size: 12px; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; }
        .order-info { margin-bottom: 15px; }
        .items { margin-bottom: 15px; }
        .total { font-weight: bold; margin-top: 10px; }
        .footer { margin-top: 20px; text-align: center; }
      </style>
    </head>
    <body>
      ${Array.from({ length: copies }, (_, index) => `
        <div class="receipt${index < copies - 1 ? ' page-break' : ''}">
          <div class="header">
            <h2>PEDIDO #${order.id}</h2>
            <p>${index === 0 ? 'VIA CLIENTE' : 'VIA ENTREGADOR'}</p>
            <p>${new Date(order.date).toLocaleString('pt-BR')}</p>
          </div>
          
          <div class="order-info">
            <p><strong>Cliente:</strong> ${order.customer}</p>
            ${order.phone ? `<p><strong>Telefone:</strong> ${order.phone}</p>` : ''}
            ${order.address ? `<p><strong>Endereço:</strong> ${order.address}</p>` : ''}
            <p><strong>Pagamento:</strong> ${paymentLabel}</p>
          </div>
          
          <div class="items">
            <h3>ITENS:</h3>
            ${orderItems.map(item => `
              <p>${item.quantity}x ${item.name} - ${item.price}</p>
            `).join('')}
          </div>
          
          <div class="total">
            <p>TOTAL: ${order.total}</p>
          </div>
          
          <div class="footer">
            <p>Obrigado pela preferência!</p>
          </div>
        </div>
      `).join('')}
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};
