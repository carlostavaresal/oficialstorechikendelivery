
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

// Mock data for different order types
const mockOrders: Record<string, Order[]> = {
  received: [
    {
      id: "#ORD-010",
      customer: "Felipe Santos",
      status: "pending",
      total: "R$ 67,50",
      date: new Date(2025, 4, 7, 15, 30),
      items: 3,
      address: "Av. Paulista, 2000",
      phone: "11987654321",
      orderItems: [
        { name: "Combo Hambúrguer", quantity: 1, price: "R$ 35,50" },
        { name: "Batata Grande", quantity: 1, price: "R$ 18,00" },
        { name: "Refrigerante 600ml", quantity: 1, price: "R$ 14,00" },
      ],
      paymentMethod: "credit"
    },
    {
      id: "#ORD-011",
      customer: "Marina Lima",
      status: "pending",
      total: "R$ 45,00",
      date: new Date(2025, 4, 7, 16, 15),
      items: 2,
      address: "Rua Augusta, 800",
      phone: "11976543210",
      orderItems: [
        { name: "Pizza Média", quantity: 1, price: "R$ 35,00" },
        { name: "Refrigerante 2L", quantity: 1, price: "R$ 10,00" },
      ],
      paymentMethod: "pix"
    }
  ],
  sent: [
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
      id: "#ORD-005",
      customer: "Lucas Mendes",
      status: "delivered",
      total: "R$ 63,75",
      date: new Date(2025, 4, 4, 12, 10),
      items: 3,
      address: "Rua Oscar Freire, 200",
      phone: "11955443322",
      orderItems: [
        { name: "Parmegiana", quantity: 1, price: "R$ 45,75" },
        { name: "Água Mineral", quantity: 2, price: "R$ 9,00" },
      ],
      paymentMethod: "credit"
    },
    {
      id: "#ORD-008",
      customer: "Fernanda Lima",
      status: "delivered",
      total: "R$ 35,20",
      date: new Date(2025, 4, 4, 17, 15),
      items: 2,
      address: "Av. Brigadeiro Faria Lima, 3000",
      phone: "11944332211",
      orderItems: [
        { name: "Salada Caesar", quantity: 1, price: "R$ 26,20" },
        { name: "Suco de Laranja", quantity: 1, price: "R$ 9,00" },
      ],
      paymentMethod: "credit"
    }
  ],
  cancelled: [
    {
      id: "#ORD-004",
      customer: "Mariana Souza",
      status: "cancelled",
      total: "R$ 45,20",
      date: new Date(2025, 4, 4, 18, 22),
      items: 4,
      address: "Alameda Santos, 45",
      phone: "11966554433",
      orderItems: [
        { name: "Salada Caesar", quantity: 1, price: "R$ 25,20" },
        { name: "Suco Natural", quantity: 2, price: "R$ 10,00" },
      ],
      paymentMethod: "debit"
    },
    {
      id: "#ORD-009",
      customer: "Ricardo Alves",
      status: "cancelled",
      total: "R$ 82,50",
      date: new Date(2025, 4, 5, 19, 45),
      items: 3,
      address: "Rua Haddock Lobo, 400",
      phone: "11933221100",
      orderItems: [
        { name: "Combo Família", quantity: 1, price: "R$ 72,50" },
        { name: "Sobremesa", quantity: 1, price: "R$ 10,00" },
      ],
      paymentMethod: "cash"
    }
  ]
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
