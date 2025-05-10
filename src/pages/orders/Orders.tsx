import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HomeIcon } from "lucide-react";
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
  address: string;
  phone?: string;
  orderItems?: OrderItem[];
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
    address: "Rua das Flores, 123",
    phone: "11999887766",
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
    address: "Av. Paulista, 1000",
    phone: "11988776655",
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
    address: "Rua Augusta, 500",
    paymentMethod: "cash"
  },
  {
    id: "#ORD-004",
    customer: "Mariana Souza",
    status: "cancelled",
    total: "R$ 45,20",
    date: new Date(2025, 4, 4, 18, 22),
    items: 4,
    address: "Alameda Santos, 45",
    paymentMethod: "debit"
  },
  {
    id: "#ORD-005",
    customer: "Lucas Mendes",
    status: "delivered",
    total: "R$ 63,75",
    date: new Date(2025, 4, 4, 12, 10),
    items: 3,
    address: "Rua Oscar Freire, 200",
    paymentMethod: "credit"
  },
  {
    id: "#ORD-006",
    customer: "Juliana Alves",
    status: "processing",
    total: "R$ 42,30",
    date: new Date(2025, 4, 5, 8, 25),
    items: 2,
    address: "Av. Rebouças, 1500",
    paymentMethod: "pix"
  },
  {
    id: "#ORD-007",
    customer: "Roberto Santos",
    status: "pending",
    total: "R$ 87,50",
    date: new Date(2025, 4, 5, 11, 40),
    items: 6,
    address: "Rua Consolação, 800",
    paymentMethod: "cash"
  },
  {
    id: "#ORD-008",
    customer: "Fernanda Lima",
    status: "delivered",
    total: "R$ 35,20",
    date: new Date(2025, 4, 4, 17, 15),
    items: 2,
    address: "Av. Brigadeiro Faria Lima, 3000",
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

// Extract order number from order ID for sorting
const extractOrderNumber = (orderId: string): number => {
  // Extract the numeric part from strings like "#ORD-001"
  const match = orderId.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
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

const Orders: React.FC = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort orders by number on initial load
  useEffect(() => {
    setOrders(prevOrders => 
      [...prevOrders].sort((a, b) => extractOrderNumber(a.id) - extractOrderNumber(b.id))
    );
  }, []);

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
    <DashboardLayout>
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <HomeIcon className="h-3 w-3 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pedidos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pedidos</h1>
        </div>

        <div className="rounded-lg border bg-card shadow">
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
                  <TableHead>Endereço</TableHead>
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
                      {formatDistanceToNow(order.date, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>{order.items} itens</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {order.address}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      <OrderModal 
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </DashboardLayout>
  );
};

export default Orders;
