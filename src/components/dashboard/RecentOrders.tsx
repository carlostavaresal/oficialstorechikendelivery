import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNowLocalized } from "@/lib/formatters";
import OrderModal from "@/components/orders/OrderModal";
import { PaymentMethod } from "@/components/payment/PaymentMethodSelector";
import { useToast } from "@/hooks/use-toast";
import { playNotificationSound, NOTIFICATION_SOUNDS } from "@/lib/soundUtils";
import { useOrders } from "@/hooks/useOrders";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "delivered":
      return "outline";
    case "processing":
      return "secondary";
    case "pending":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "delivered":
      return "Entregue";
    case "processing":
      return "Em preparo";
    case "pending":
      return "Aguardando";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
};

// Format WhatsApp number for proper linking
const formatPhoneForWhatsApp = (phone: string) => {
  const numericOnly = phone.replace(/\D/g, "");
  if (numericOnly.length === 11 || numericOnly.length === 10) {
    return `55${numericOnly}`;
  }
  return numericOnly;
};

const RecentOrders: React.FC = () => {
  const { toast } = useToast();
  const { orders, loading, updateOrderStatus } = useOrders();
  const { settings } = useCompanySettings();
  const { sendOrderToWhatsApp } = useWhatsAppIntegration();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOrderDetails = (order: any) => {
    const formattedOrder = {
      id: order.order_number,
      customer: order.customer_name,
      status: order.status,
      total: `R$ ${order.total_amount.toFixed(2)}`,
      date: new Date(order.created_at),
      items: order.items.length,
      address: order.customer_address,
      phone: order.customer_phone,
      orderItems: order.items,
      paymentMethod: order.payment_method as PaymentMethod,
      notes: order.notes
    };
    setSelectedOrder(formattedOrder);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Find the order by order_number instead of id
    const order = orders.find(o => o.order_number === orderId);
    if (!order) return;

    const success = await updateOrderStatus(order.id, newStatus as any);
    
    if (!success) return;
    
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
        statusMessage = "em preparação";
        toastTitle = "Pedido em Preparação";
        break;
      case "pending":
        soundToPlay = NOTIFICATION_SOUNDS.NEW_ORDER;
        statusMessage = "aguardando";
        toastTitle = "Pedido Aguardando";
        break;
    }
    
    // Play appropriate sound
    playNotificationSound(soundToPlay, 0.5);
    
    // Show toast notification
    toast({
      title: toastTitle,
      description: `O pedido ${orderId} foi alterado para ${statusMessage}`,
    });
    
    // Send WhatsApp notification to customer if phone is available
    if (order.customer_phone && settings?.whatsapp_number) {
      const message = encodeURIComponent(
        `Olá ${order.customer_name}, seu pedido ${orderId} foi alterado para ${statusMessage}. Para mais informações entre em contato conosco.`
      );
      window.open(`https://wa.me/${formatPhoneForWhatsApp(order.customer_phone)}?text=${message}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-card shadow animate-slide-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold">Pedidos Recentes</h2>
        </div>
        <div className="p-6 text-center text-muted-foreground">
          <p>Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  // Show only the last 5 orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="rounded-lg border bg-card shadow animate-slide-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold">Pedidos Recentes - Tempo Real</h2>
        <Link
          to="/orders"
          className="text-sm text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>
      <div className="overflow-x-auto">
        {recentOrders.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>Nenhum pedido encontrado</p>
            <p className="text-sm mt-1">Os pedidos aparecerão aqui em tempo real quando forem realizados</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Itens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  className={`cursor-pointer hover:bg-muted ${order.status === "cancelled" ? "bg-muted/30" : ""} ${order.status === "pending" ? "bg-yellow-50 border-l-4 border-l-yellow-400" : ""}`}
                  onClick={() => handleOpenOrderDetails(order)}
                >
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell className="font-medium">{order.customer_name}</TableCell>
                  <TableCell className="text-sm">{order.customer_phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm" title={order.customer_address}>
                    {order.customer_address}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">R$ {order.total_amount.toFixed(2)}</TableCell>
                  <TableCell className="text-sm">
                    {formatDistanceToNowLocalized(new Date(order.created_at))}
                  </TableCell>
                  <TableCell className="text-center">{order.items.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <OrderModal 
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default RecentOrders;
