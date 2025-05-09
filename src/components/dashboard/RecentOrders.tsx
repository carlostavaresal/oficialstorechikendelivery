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
  total: string;
  date: Date;
  items: number;
  phone?: string;
  orderItems?: OrderItem[];
  address?: string;
  paymentMethod?: PaymentMethod;
}

const mockOrders: Order[] = [
  {
    id: "#ORD-001",
    customer: "Carlos Silva",
    status: "delivered",
    total: "R$ 54,90",
    date: new Date(2025, 4, 4, 15, 30),
    items: 3,
    phone: "11999887766",
    address: "Rua das Flores, 123",
    orderItems: [
      { name: "X-Burger", quantity: 1, price: "R$ 24,90" },
      { name: "Batata Frita", quantity: 1, price: "R$ 15,00" },
      { name: "Refrigerante", quantity: 1, price: "R$ 15,00" },
    ],
    paymentMethod: "credit"
  },
  {
    id: "#ORD-002",
    customer: "Ana Oliveira",
    status: "processing",
    total: "R$ 32,50",
    date: new Date(2025, 4, 5, 10, 15),
    items: 2,
    phone: "11988776655",
    address: "Av. Paulista, 1000",
    orderItems: [
      { name: "Pizza Média", quantity: 1, price: "R$ 32,50" },
    ],
    paymentMethod: "pix"
  },
  {
    id: "#ORD-003",
    customer: "Paulo Costa",
    status: "pending",
    total: "R$ 78,00",
    date: new Date(2025, 4, 5, 9, 45),
    items: 5,
    phone: "11977665544",
    address: "Rua Augusta, 500",
    orderItems: [
      { name: "Combo Família", quantity: 1, price: "R$ 78,00" },
    ],
    paymentMethod: "cash"
  },
  {
    id: "#ORD-004",
    customer: "Mariana Souza",
    status: "cancelled",
    total: "R$ 45,20",
    date: new Date(2025, 4, 4, 18, 22),
    items: 4,
    phone: "11966554433",
    address: "Alameda Santos, 45",
    orderItems: [
      { name: "Salada Caesar", quantity: 1, price: "R$ 25,20" },
      { name: "Suco Natural", quantity: 2, price: "R$ 10,00" },
    ],
    paymentMethod: "debit"
  },
  {
    id: "#ORD-005",
    customer: "Lucas Mendes",
    status: "delivered",
    total: "R$ 63,75",
    date: new Date(2025, 4, 4, 12, 10),
    items: 3,
    phone: "11955443322",
    address: "Rua Consolação, 800",
    orderItems: [
      { name: "Parmegiana", quantity: 1, price: "R$ 45,75" },
      { name: "Água Mineral", quantity: 2, price: "R$ 9,00" },
    ],
    paymentMethod: "credit"
  },
];

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

// This would come from an API in a real app
const checkForNewOrders = (): Order | null => {
  // Simulate a 20% chance of receiving a new order
  if (Math.random() < 0.2) {
    const newOrder: Order = {
      id: `#ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customer: "Novo Cliente",
      status: "pending",
      total: `R$ ${(Math.random() * 100).toFixed(2).replace('.', ',')}`,
      date: new Date(),
      items: Math.floor(Math.random() * 5) + 1,
      phone: "11999887766",
      address: "Rua das Flores, 123",
      orderItems: [
        { name: "Item de Exemplo", quantity: 1, price: "R$ 24,90" },
      ],
      paymentMethod: "pix"
    };
    return newOrder;
  }
  return null;
};

const RecentOrders: React.FC = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastOrderCountRef = useRef(orders.length);
  
  useEffect(() => {
    // Check for new orders every 30 seconds
    const intervalId = setInterval(() => {
      const newOrder = checkForNewOrders();
      
      if (newOrder) {
        setOrders(prevOrders => [newOrder, ...prevOrders.slice(0, 4)]);
        
        // Play notification sound
        playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER, 0.7);
        
        // Show toast notification
        toast({
          title: "Novo Pedido Recebido!",
          description: `Pedido ${newOrder.id} de ${newOrder.customer} - ${newOrder.total}`,
        });
        
        // Send WhatsApp notification to the admin (in a real app, you'd use your admin number)
        // This is just a simulation for demonstration purposes
        if (newOrder.phone) {
          const adminMessage = encodeURIComponent(
            `Novo pedido recebido: ${newOrder.id} de ${newOrder.customer} - ${newOrder.total}`
          );
          console.log(`WhatsApp notification would be sent: https://wa.me/${formatPhoneForWhatsApp("11999999999")}?text=${adminMessage}`);
        }
      }
    }, 30000); // Check every 30 seconds
    
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
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  {formatDistanceToNowLocalized(order.date)}
                </TableCell>
                <TableCell>{order.items} itens</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
