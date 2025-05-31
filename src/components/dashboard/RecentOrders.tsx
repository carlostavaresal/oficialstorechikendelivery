
import React, { useState, useEffect, useRef } from "react";
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

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  customer: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: string | number;
  date: Date;
  items: number;
  phone?: string;
  orderItems?: OrderItem[];
  address?: string;
  paymentMethod?: PaymentMethod;
}

const getStatusBadgeVariant = (status: Order["status"]) => {
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

const getStatusLabel = (status: Order["status"]) => {
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
  // Remove non-numeric characters
  const numericOnly = phone.replace(/\D/g, "");
  
  // Add country code if not present (assuming Brazil)
  if (numericOnly.length === 11 || numericOnly.length === 10) {
    return `55${numericOnly}`;
  }
  
  return numericOnly;
};

// Extract order number from order ID for sorting
const extractOrderNumber = (orderId: string): number => {
  // Extract the numeric part from strings like "#ORD-001"
  const match = orderId.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// This would come from an API in a real app
const checkForNewOrders = (): Order | null => {
  // Load orders from localStorage instead of generating random ones
  const savedOrders = localStorage.getItem("orders");
  if (savedOrders) {
    const orders = JSON.parse(savedOrders);
    // Return the most recent order if there are any new ones
    if (orders.length > 0) {
      return orders[orders.length - 1];
    }
  }
  return null;
};

const RecentOrders: React.FC = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastOrderCountRef = useRef(orders.length);
  
  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      const loadedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        date: new Date(order.date)
      }));
      setOrders(loadedOrders.slice(-5)); // Show only the last 5 orders
    }
  }, []);
  
  useEffect(() => {
    // Check for new orders every 30 seconds
    const intervalId = setInterval(() => {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const loadedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          date: new Date(order.date)
        }));
        
        // Check if there are new orders
        if (loadedOrders.length > lastOrderCountRef.current) {
          const newOrder = loadedOrders[loadedOrders.length - 1];
          
          setOrders(loadedOrders.slice(-5)); // Show only the last 5 orders
          
          // Play notification sound
          playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER, 0.7);
          
          // Show toast notification
          toast({
            title: "Novo Pedido Recebido!",
            description: `Pedido ${newOrder.id} de ${newOrder.customer} - R$ ${typeof newOrder.total === 'number' ? newOrder.total.toFixed(2) : newOrder.total}`,
          });
          
          lastOrderCountRef.current = loadedOrders.length;
        }
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [toast]);

  // Play sound when orders are added (for initial page load or external updates)
  useEffect(() => {
    // Only play sound if the number of orders has increased
    if (orders.length > lastOrderCountRef.current) {
      playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER, 0.7);
      lastOrderCountRef.current = orders.length;
    }
  }, [orders.length]);

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    setSelectedOrder(prevOrder => 
      prevOrder && prevOrder.id === orderId ? 
      { ...prevOrder, status: newStatus } : prevOrder
    );
    
    // Find the updated order to send appropriate notification
    const updatedOrder = orders.find(order => order.id === orderId);
    
    if (!updatedOrder) return;
    
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
    if (updatedOrder.phone) {
      const message = encodeURIComponent(
        `Olá ${updatedOrder.customer}, seu pedido ${orderId} foi alterado para ${statusMessage}. Para mais informações entre em contato conosco.`
      );
      window.open(`https://wa.me/${formatPhoneForWhatsApp(updatedOrder.phone)}?text=${message}`, "_blank");
    }
  };

  return (
    <div className="rounded-lg border bg-card shadow animate-slide-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold">Pedidos Recentes</h2>
        <Link
          to="/orders"
          className="text-sm text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>Nenhum pedido encontrado</p>
            <p className="text-sm mt-1">Os pedidos aparecerão aqui quando forem realizados</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Itens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow 
                  key={order.id}
                  className={`cursor-pointer hover:bg-muted ${order.status === "cancelled" ? "bg-muted/30" : ""}`}
                  onClick={() => handleOpenOrderDetails(order)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</TableCell>
                  <TableCell>
                    {formatDistanceToNowLocalized(order.date)}
                  </TableCell>
                  <TableCell>{Array.isArray(order.items) ? order.items.length : order.items} itens</TableCell>
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
