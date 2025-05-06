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
    ]
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
    ]
  },
  {
    id: "#ORD-003",
    customer: "Paulo Costa",
    status: "pending",
    total: "R$ 78,00",
    date: new Date(2025, 4, 5, 9, 45),
    items: 5,
    address: "Rua Augusta, 500",
  },
  {
    id: "#ORD-004",
    customer: "Mariana Souza",
    status: "cancelled",
    total: "R$ 45,20",
    date: new Date(2025, 4, 4, 18, 22),
    items: 4,
    address: "Alameda Santos, 45",
  },
  {
    id: "#ORD-005",
    customer: "Lucas Mendes",
    status: "delivered",
    total: "R$ 63,75",
    date: new Date(2025, 4, 4, 12, 10),
    items: 3,
    address: "Rua Oscar Freire, 200",
  },
  {
    id: "#ORD-006",
    customer: "Juliana Alves",
    status: "processing",
    total: "R$ 42,30",
    date: new Date(2025, 4, 5, 8, 25),
    items: 2,
    address: "Av. Rebouças, 1500",
  },
  {
    id: "#ORD-007",
    customer: "Roberto Santos",
    status: "pending",
    total: "R$ 87,50",
    date: new Date(2025, 4, 5, 11, 40),
    items: 6,
    address: "Rua Consolação, 800",
  },
  {
    id: "#ORD-008",
    customer: "Fernanda Lima",
    status: "delivered",
    total: "R$ 35,20",
    date: new Date(2025, 4, 4, 17, 15),
    items: 2,
    address: "Av. Brigadeiro Faria Lima, 3000",
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

const Orders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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
                {mockOrders.map((order) => (
                  <TableRow 
                    key={order.id}
                    className="cursor-pointer hover:bg-muted"
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
      />
    </DashboardLayout>
  );
};

export default Orders;
