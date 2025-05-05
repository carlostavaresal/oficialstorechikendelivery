
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Order {
  id: string;
  customer: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: string;
  date: Date;
  items: number;
}

const mockOrders: Order[] = [
  {
    id: "#ORD-001",
    customer: "Carlos Silva",
    status: "delivered",
    total: "R$ 54,90",
    date: new Date(2025, 4, 4, 15, 30),
    items: 3,
  },
  {
    id: "#ORD-002",
    customer: "Ana Oliveira",
    status: "processing",
    total: "R$ 32,50",
    date: new Date(2025, 4, 5, 10, 15),
    items: 2,
  },
  {
    id: "#ORD-003",
    customer: "Paulo Costa",
    status: "pending",
    total: "R$ 78,00",
    date: new Date(2025, 4, 5, 9, 45),
    items: 5,
  },
  {
    id: "#ORD-004",
    customer: "Mariana Souza",
    status: "cancelled",
    total: "R$ 45,20",
    date: new Date(2025, 4, 4, 18, 22),
    items: 4,
  },
  {
    id: "#ORD-005",
    customer: "Lucas Mendes",
    status: "delivered",
    total: "R$ 63,75",
    date: new Date(2025, 4, 4, 12, 10),
    items: 3,
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
  return (
    <div className="rounded-lg border bg-card shadow animate-slide-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold">Pedidos Recentes</h2>
        <a
          href="/orders"
          className="text-sm text-primary hover:underline"
        >
          Ver todos
        </a>
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
              <TableRow key={order.id}>
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
                    locale: ptBR 
                  })}
                </TableCell>
                <TableCell>{order.items} itens</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentOrders;
