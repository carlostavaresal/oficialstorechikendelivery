
import { formatDate } from "./formatters";
import { PaymentMethod } from "@/components/payment/PaymentMethodSelector";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface PrintableOrder {
  id: string;
  customer: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: string;
  date: Date;
  phone?: string;
  orderItems?: OrderItem[];
  address?: string;
  paymentMethod?: PaymentMethod;
}

const getPaymentMethodLabel = (method: PaymentMethod | undefined): string => {
  if (!method) return "Não informado";
  switch (method) {
    case "cash": return "Dinheiro";
    case "pix": return "Pix";
    case "credit": return "Cartão de Crédito";
    case "debit": return "Cartão de Débito";
    default: return "Não informado";
  }
};

export const printOrder = (order: PrintableOrder, copies: number = 2) => {
  // Get print settings from localStorage or use defaults
  const storedSettings = localStorage.getItem("printerSettings");
  const printerSettings = storedSettings ? JSON.parse(storedSettings) : {
    paperWidth: "80mm",
    receiptHeight: "8cm"
  };
  
  // Create a new hidden iframe for printing
  const printFrame = document.createElement("iframe");
  printFrame.style.position = "absolute";
  printFrame.style.top = "-9999px";
  printFrame.style.left = "-9999px";
  document.body.appendChild(printFrame);
  
  // Create receipt content
  const receiptContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Recibo de Pedido</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          width: ${printerSettings.paperWidth === "80mm" ? "76mm" : "54mm"};
          height: ${printerSettings.receiptHeight === "automatic" ? "auto" : printerSettings.receiptHeight};
          padding: 2mm;
          margin: 0;
          box-sizing: border-box;
        }
        .receipt {
          width: 100%;
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
          margin-bottom: ${copies > 1 ? "20px" : "0"};
          page-break-after: ${copies > 1 ? "always" : "auto"};
        }
        .receipt:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
        }
        .title {
          font-weight: bold;
          font-size: 14px;
        }
        .copy-type {
          font-weight: bold;
          text-align: center;
          margin: 5px 0;
          text-transform: uppercase;
        }
        .info {
          margin-bottom: 10px;
        }
        .info div {
          margin-bottom: 2px;
        }
        .items {
          width: 100%;
          margin-bottom: 10px;
        }
        .items-header {
          font-weight: bold;
          border-bottom: 1px solid #000;
        }
        .item {
          display: flex;
          justify-content: space-between;
        }
        .item-qty {
          width: 20%;
          text-align: left;
        }
        .item-name {
          width: 50%;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-price {
          width: 30%;
          text-align: right;
        }
        .total {
          text-align: right;
          font-weight: bold;
          border-top: 1px solid #000;
          padding-top: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 10px;
          font-size: 12px;
        }
        @media print {
          @page {
            margin: 0;
            size: ${printerSettings.paperWidth} ${printerSettings.receiptHeight === "automatic" ? "auto" : printerSettings.receiptHeight};
          }
        }
      </style>
    </head>
    <body>
      ${Array(copies).fill(null).map((_, index) => `
        <div class="receipt">
          <div class="header">
            <div class="title">COMPROVANTE DE PEDIDO</div>
            <div>${formatDate(new Date())}</div>
          </div>
          <div class="copy-type">${index === 0 ? "Via do Cliente" : "Via do Entregador"}</div>
          <div class="info">
            <div><strong>Pedido:</strong> ${order.id}</div>
            <div><strong>Cliente:</strong> ${order.customer}</div>
            ${order.phone ? `<div><strong>Telefone:</strong> ${order.phone}</div>` : ''}
            ${order.address ? `<div><strong>Endereço:</strong> ${order.address}</div>` : ''}
            <div><strong>Pagamento:</strong> ${getPaymentMethodLabel(order.paymentMethod)}</div>
          </div>
          <div class="items">
            <div class="items-header">
              <div class="item">
                <div class="item-qty">Qtd</div>
                <div class="item-name">Item</div>
                <div class="item-price">Preço</div>
              </div>
            </div>
            ${(order.orderItems || []).map(item => `
              <div class="item">
                <div class="item-qty">${item.quantity}x</div>
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price}</div>
              </div>
            `).join('')}
          </div>
          <div class="total">Total: ${order.total}</div>
          <div class="footer">
            Obrigado pela preferência!
          </div>
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  // Write the content to the iframe and print it
  const frameDoc = printFrame.contentWindow?.document;
  if (frameDoc) {
    frameDoc.open();
    frameDoc.write(receiptContent);
    frameDoc.close();
    
    // Add event listener for when printing is done
    printFrame.onload = function() {
      setTimeout(function() {
        printFrame.contentWindow?.print();
        // Remove the iframe after printing (with a delay to ensure printing completes)
        setTimeout(function() {
          document.body.removeChild(printFrame);
        }, 1000);
      }, 500);
    };
  }
};
