
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
import { HomeIcon, History as HistoryIcon } from "lucide-react";
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
import { formatDistanceToNowLocalized, formatDate } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import OrderModal from "@/components/orders/OrderModal";
import { PaymentMethod } from "@/components/payment/PaymentMethodSelector";

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

// Start with empty orders for all categories
const mockOrders: Record<string, Order[]> = {
  received: [],
  sent: [],
  cancelled: []
};

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

const OrdersTable: React.FC<{ orders: Order[], onOpenOrder: (order: Order) => void }> = ({ 
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
                  <TableCell className="max-w-[200px] truncate">
                    {order.address}
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
  const [selectedTab, setSelectedTab] = useState("received");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const currentOrders = mockOrders[selectedTab] || [];

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
                Recebidos
                <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">{mockOrders.received.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="sent" className="relative">
                Enviados
                <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">{mockOrders.sent.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="relative">
                Cancelados
                <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">{mockOrders.cancelled.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="received" className="mt-0">
              <OrdersTable 
                orders={mockOrders.received}
                onOpenOrder={handleOpenOrderDetails}
              />
            </TabsContent>
            
            <TabsContent value="sent" className="mt-0">
              <OrdersTable 
                orders={mockOrders.sent}
                onOpenOrder={handleOpenOrderDetails}
              />
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-0">
              <OrdersTable 
                orders={mockOrders.cancelled}
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
