
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

const RecentOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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
      />
    </div>
  );
};

export default RecentOrders;
