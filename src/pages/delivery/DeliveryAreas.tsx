
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MapPin, Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeliveryZoneModal from "@/components/delivery/DeliveryZoneModal";
import AddressSetupCard from "@/components/delivery/AddressSetupCard";

// Define the BusinessAddress interface to be used throughout the component
export interface BusinessAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string; // Note: This is postalCode, not zipCode
  complement?: string;
}

// Export DeliveryZone interface for use in other components
export interface DeliveryZone {
  id: string;
  name: string;
  radius: number;
  fee: number;
  estimatedTime: number;
}

const DeliveryAreas: React.FC = () => {
  // Modify the businessAddress state to match the BusinessAddress interface
  const [businessAddress, setBusinessAddress] = useState<BusinessAddress | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const { toast } = useToast();

  // Load zones from localStorage when component mounts
  useEffect(() => {
    try {
      const savedZones = localStorage.getItem("deliveryZones");
      if (savedZones) {
        setZones(JSON.parse(savedZones));
      }
    } catch (error) {
      console.error("Error loading delivery zones:", error);
    }

    // Load business address
    try {
      const savedAddress = localStorage.getItem("businessAddress");
      if (savedAddress) {
        setBusinessAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error("Error loading business address:", error);
    }
  }, []);

  // Save zones to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("deliveryZones", JSON.stringify(zones));
  }, [zones]);

  // Save business address to localStorage whenever it changes
  useEffect(() => {
    if (businessAddress) {
      localStorage.setItem("businessAddress", JSON.stringify(businessAddress));
    }
  }, [businessAddress]);

  // Handler for updating the business address
  const handleSetBusinessAddress = (address: BusinessAddress) => {
    setBusinessAddress(address);
    toast({
      title: "Endereço atualizado",
      description: "O endereço da empresa foi atualizado com sucesso.",
    });
  };

  // Handle adding or updating a delivery zone
  const handleAddZone = (zone: DeliveryZone) => {
    if (editingZone) {
      // Update existing zone
      setZones(zones.map((z) => (z.id === zone.id ? zone : z)));
      toast({
        title: "Zona atualizada",
        description: `A zona de entrega "${zone.name}" foi atualizada.`,
      });
    } else {
      // Add new zone
      setZones([...zones, { ...zone, id: crypto.randomUUID() }]);
      toast({
        title: "Zona adicionada",
        description: `Nova zona de entrega "${zone.name}" adicionada.`,
      });
    }
    setEditingZone(null);
    setIsModalOpen(false);
  };

  // Handle deleting a delivery zone
  const handleDeleteZone = (id: string) => {
    setZones(zones.filter((zone) => zone.id !== id));
    toast({
      title: "Zona removida",
      description: "A zona de entrega foi removida com sucesso.",
      variant: "destructive",
    });
  };

  // Handle editing a delivery zone
  const handleEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Áreas de Entrega</h1>
        
        {/* Business Address Setup */}
        <AddressSetupCard
          address={businessAddress ? {
            street: businessAddress.street,
            number: businessAddress.number,
            neighborhood: businessAddress.neighborhood,
            city: businessAddress.city,
            state: businessAddress.state,
            zipCode: businessAddress.postalCode, // Map postalCode to zipCode for the component
            complement: businessAddress.complement || ""
          } : {
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            zipCode: "",
            complement: ""
          }}
          onAddressUpdate={handleSetBusinessAddress}
        />

        {/* Delivery Zones Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Zonas de Entrega</CardTitle>
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Adicionar Zona
            </Button>
          </CardHeader>
          <CardContent>
            {!businessAddress ? (
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                <p className="text-amber-700">
                  Configure o endereço da empresa para começar a definir zonas de entrega.
                </p>
              </div>
            ) : zones.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                <p>Nenhuma zona de entrega definida</p>
                <p className="text-sm">
                  Crie zonas de entrega para definir taxas e tempos estimados para diferentes regiões.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center justify-between border p-4 rounded-md"
                  >
                    <div>
                      <h3 className="font-medium">{zone.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>Raio: {zone.radius} km</p>
                        <p>Taxa: R$ {zone.fee.toFixed(2)}</p>
                        <p>Tempo estimado: {zone.estimatedTime} min</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditZone(zone)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal for adding/editing zones */}
        {isModalOpen && (
          <DeliveryZoneModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingZone(null);
            }}
            onSave={handleAddZone}
            initialZone={editingZone}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DeliveryAreas;
