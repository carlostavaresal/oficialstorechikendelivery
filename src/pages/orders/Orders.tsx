
import React, { useState } from "react";
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
import { useOrders } from "@/hooks/useOrders";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";

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
      return "Saiu para entrega";
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

const Orders: React.FC = () => {
  const { toast } = useToast();
  const { orders, loading, updateOrderStatus } = useOrders();
  const { settings } = useCompanySettings();
  const { sendDeliveryNotification, handleStatusChangeNotification } = useOrderNotifications();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOrderDetails = (order: any) => {
    const formattedOrder = {
      id: order.order_number,
      customer: order.customer_name,
      status: order.status,
      total: `€ ${order.total_amount.toFixed(2)}`,
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
    
    // Use the new notification system
    handleStatusChangeNotification(order, newStatus);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Pedidos</h1>
          </div>
          <div className="rounded-lg border bg-card shadow">
            <div className="p-6 text-center text-muted-foreground">
              <p>Carregando pedidos...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-3xl font-bold">Pedidos em Tempo Real</h1>
        </div>

        <div className="rounded-lg border bg-card shadow">
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
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Endereço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow 
                      key={order.id}
                      className={`cursor-pointer hover:bg-muted ${
                        order.status === "pending" ? "bg-yellow-50 border-l-4 border-l-yellow-400" : 
                        order.status === "processing" ? "bg-blue-50 border-l-4 border-l-blue-400" :
                        order.status === "cancelled" ? "bg-red-50 border-l-4 border-l-red-400" : ""
                      }`}
                      onClick={() => handleOpenOrderDetails(order)}
                    >
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>€ {order.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {order.customer_address}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
