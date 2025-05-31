
import React from "react";
import { MapPin, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DeliveryLocation {
  id: string;
  address: string;
  status: "on-way" | "delivered" | "pending";
  estimatedTime?: string;
}

const getStatusLabel = (status: DeliveryLocation["status"]) => {
  switch (status) {
    case "on-way":
      return "A caminho";
    case "delivered":
      return "Entregue";
    case "pending":
      return "Aguardando";
    default:
      return status;
  }
};

const getStatusVariant = (status: DeliveryLocation["status"]) => {
  switch (status) {
    case "on-way":
      return "secondary";
    case "delivered":
      return "outline";
    case "pending":
      return "default";
    default:
      return "default";
  }
};

const DeliveryMap: React.FC = () => {
  // Start with empty deliveries array
  const deliveries: DeliveryLocation[] = [];

  return (
    <Card className="animate-slide-in h-full" style={{ animationDelay: "0.3s" }}>
      <CardHeader>
        <CardTitle>Entregas em Andamento</CardTitle>
        <CardDescription>
          Acompanhamento das entregas em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[300px] bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Mapa de entrega será carregado aqui
            </p>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white">
              <Package className="mr-1 h-3 w-3" />
              <span>{deliveries.filter(d => d.status === 'on-way').length} entregas ativas</span>
            </Badge>
          </div>
        </div>
        {deliveries.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>Nenhuma entrega em andamento</p>
            <p className="text-sm mt-1">As entregas aparecerão aqui quando iniciadas</p>
          </div>
        ) : (
          <div className="divide-y">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{delivery.address}</p>
                    <p className="text-xs text-muted-foreground">ID: {delivery.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant={getStatusVariant(delivery.status)}>
                    {getStatusLabel(delivery.status)}
                  </Badge>
                  {delivery.estimatedTime && (
                    <span className="mt-1 text-xs text-muted-foreground">
                      {delivery.estimatedTime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryMap;
