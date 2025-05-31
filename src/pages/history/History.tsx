
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowLocalized } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import OrderModal from "@/components/orders/OrderModal";
import { PaymentMethod } from "@/components/payment/PaymentMethodSelector";
import { useOrders } from "@/hooks/useOrders";

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

const OrdersTable: React.FC<{ orders: any[], onOpenOrder: (order: any) => void }> = ({ 
  orders,
  onOpenOrder
}) => {
  return (
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => onOpenOrder(order)}
                >
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {formatDistanceToNowLocalized(new Date(order.created_at))}
                  </TableCell>
                  <TableCell>{order.items.length} itens</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {order.customer_address}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhum pedido encontrado nesta categoria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {orders.length > 0 && (
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

const History: React.FC = () => {
  const { orders, loading } = useOrders();
  const [selectedTab, setSelectedTab] = useState("received");
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

  // Filter orders by status
  const receivedOrders = orders.filter(order => order.status === 'delivered');
  const sentOrders = orders.filter(order => order.status === 'processing');
  const cancelledOrders = orders.filter(order => order.status === 'cancelled');

  const getCurrentOrders = () => {
    switch (selectedTab) {
      case "received":
        return receivedOrders;
      case "sent":
        return sentOrders;
      case "cancelled":
        return cancelledOrders;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Histórico de Pedidos</h1>
          </div>
          <Card className="p-6">
            <p>Carregando histórico...</p>
          </Card>
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
              <BreadcrumbPage>Histórico</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Histórico de Pedidos</h1>
        </div>

        <Card className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="received" className="relative">
                Entregues
                <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">{receivedOrders.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="sent" className="relative">
                Em Preparo
                <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">{sentOrders.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="relative">
                Cancelados
                <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">{cancelledOrders.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="received" className="mt-0">
              <OrdersTable 
                orders={receivedOrders}
                onOpenOrder={handleOpenOrderDetails}
              />
            </TabsContent>
            
            <TabsContent value="sent" className="mt-0">
              <OrdersTable 
                orders={sentOrders}
                onOpenOrder={handleOpenOrderDetails}
              />
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-0">
              <OrdersTable 
                orders={cancelledOrders}
                onOpenOrder={handleOpenOrderDetails}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <OrderModal 
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default History;
