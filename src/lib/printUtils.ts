
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
  notes?: string;
}

const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case "cash": return "Dinheiro";
    case "pix": return "Pix";
    case "credit": return "Cartão de Crédito";
    default: return "Desconhecido";
  }
};

export const printOrder = (order: Order, copies: number = 2) => {
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
          .via-label { font-weight: bold; text-align: center; margin: 10px 0; }
        }
        body { font-family: monospace; font-size: 12px; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
        .order-info { margin-bottom: 15px; }
        .items { margin-bottom: 15px; border-top: 1px dashed #000; padding-top: 10px; }
        .total { font-weight: bold; margin-top: 10px; border-top: 2px solid #000; padding-top: 5px; }
        .footer { margin-top: 20px; text-align: center; border-top: 1px dashed #000; padding-top: 10px; }
        .delivery-info { background: #f5f5f5; padding: 10px; margin: 10px 0; border: 1px solid #ddd; }
      </style>
    </head>
    <body>
      ${Array.from({ length: copies }, (_, index) => `
        <div class="receipt${index < copies - 1 ? ' page-break' : ''}">
          <div class="via-label">
            ${index === 0 ? '=== VIA DO CLIENTE ===' : '=== VIA DO ENTREGADOR ==='}
          </div>
          
          <div class="header">
            <h2>PEDIDO #${order.id}</h2>
            <p><strong>Data:</strong> ${new Date(order.date).toLocaleString('pt-BR')}</p>
          </div>
          
          <div class="order-info">
            <p><strong>Cliente:</strong> ${order.customer}</p>
            ${order.phone ? `<p><strong>Telefone:</strong> ${order.phone}</p>` : ''}
            <p><strong>Pagamento:</strong> ${paymentLabel}</p>
          </div>
          
          ${order.address ? `
            <div class="delivery-info">
              <p><strong>ENDEREÇO DE ENTREGA:</strong></p>
              <p>${order.address}</p>
            </div>
          ` : ''}
          
          <div class="items">
            <h3>ITENS DO PEDIDO:</h3>
            ${orderItems.map(item => `
              <p>${item.quantity}x ${item.name} ............. ${item.price}</p>
            `).join('')}
          </div>
          
          <div class="total">
            <p><strong>TOTAL: ${order.total}</strong></p>
          </div>
          
          ${order.notes ? `
            <div style="margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px;">
              <p><strong>Observações:</strong></p>
              <p>${order.notes}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Obrigado pela preferência!</p>
            <p style="font-size: 10px;">Pedido processado em ${new Date().toLocaleString('pt-BR')}</p>
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
