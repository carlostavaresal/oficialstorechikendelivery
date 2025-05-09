
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Plus, HomeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import AddressSetupCard from "@/components/delivery/AddressSetupCard";
import DeliveryZoneModal from "@/components/delivery/DeliveryZoneModal";

export interface DeliveryZone {
  id: string;
  name: string;
  radius: number;
  description: string;
  deliveryFee: number;
  minOrderValue: number;
  active: boolean;
}

const mockDeliveryZones: DeliveryZone[] = [
  {
    id: "zone1",
    name: "Centro",
    radius: 3,
    description: "Região central da cidade",
    deliveryFee: 5.0,
    minOrderValue: 15.0,
    active: true,
  },
  {
    id: "zone2",
    name: "Zona Sul",
    radius: 5,
    description: "Região sul da cidade",
    deliveryFee: 8.0,
    minOrderValue: 20.0,
    active: true,
  },
  {
    id: "zone3",
    name: "Zona Leste",
    radius: 7,
    description: "Região leste da cidade",
    deliveryFee: 10.0,
    minOrderValue: 25.0,
    active: false,
  },
  {
    id: "zone4",
    name: "Zona Norte",
    radius: 8,
    description: "Região norte da cidade",
    deliveryFee: 12.0,
    minOrderValue: 30.0,
    active: true,
  },
];

interface BusinessAddress {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

const DeliveryAreas: React.FC = () => {
  const [zones, setZones] = useState<DeliveryZone[]>(mockDeliveryZones);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentZone, setCurrentZone] = useState<DeliveryZone | null>(null);
  const [businessAddress, setBusinessAddress] = useState<BusinessAddress>({
    street: "Avenida Paulista",
    number: "1000",
    complement: "Sala 123",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    postalCode: "01310-100",
    latitude: -23.5673,
    longitude: -46.6494,
  });

  const handleAddNewZone = () => {
    const newZone: DeliveryZone = {
      id: `zone${Date.now()}`,
      name: "",
      radius: 5,
      description: "",
      deliveryFee: 8.0,
      minOrderValue: 20.0,
      active: true,
    };
    setCurrentZone(newZone);
    setIsModalOpen(true);
  };

  const handleEditZone = (zone: DeliveryZone) => {
    setCurrentZone(zone);
    setIsModalOpen(true);
  };

  const handleSaveZone = (updatedZone: DeliveryZone) => {
    if (zones.some((z) => z.id === updatedZone.id)) {
      // Update existing zone
      setZones((currentZones) =>
        currentZones.map((z) => (z.id === updatedZone.id ? updatedZone : z))
      );
    } else {
      // Add new zone
      setZones((currentZones) => [...currentZones, updatedZone]);
    }
    setIsModalOpen(false);
    setCurrentZone(null);
  };

  const handleAddressUpdate = (address: BusinessAddress) => {
    setBusinessAddress(address);
  };

  const filteredZones = selectedFilter === "all"
    ? zones
    : selectedFilter === "active"
    ? zones.filter((zone) => zone.active)
    : zones.filter((zone) => !zone.active);

  // Format the full business address as a string
  const formattedAddress = `${businessAddress.street}, ${businessAddress.number}${
    businessAddress.complement ? ` - ${businessAddress.complement}` : ""
  }, ${businessAddress.neighborhood}, ${businessAddress.city} - ${
    businessAddress.state
  }, ${businessAddress.postalCode}`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
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
                  <BreadcrumbPage>Áreas de Entrega</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold mt-2">Áreas de Entrega</h1>
          </div>
          <Button onClick={handleAddNewZone}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Área
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Endereço do Estabelecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddressSetupCard 
              address={businessAddress} 
              onAddressUpdate={handleAddressUpdate} 
            />
          </CardContent>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Zonas de Entrega</h2>
            <Select
              value={selectedFilter}
              onValueChange={setSelectedFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="active">Áreas ativas</SelectItem>
                <SelectItem value="inactive">Áreas inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredZones.map((zone) => (
              <Card
                key={zone.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !zone.active ? "opacity-60" : ""
                }`}
                onClick={() => handleEditZone(zone)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    <Badge variant={zone.active ? "default" : "outline"}>
                      {zone.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {zone.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Raio de entrega:</span>
                      <span className="font-medium">{zone.radius} km</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Taxa de entrega:</span>
                      <span className="font-medium">
                        {formatCurrency(zone.deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pedido mínimo:</span>
                      <span className="font-medium">
                        {formatCurrency(zone.minOrderValue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {currentZone && (
        <DeliveryZoneModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveZone}
          zone={currentZone}
        />
      )}
    </DashboardLayout>
  );
};

export default DeliveryAreas;
