
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MapPin, Plus, Edit, Trash, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeliveryZoneModal from "@/components/delivery/DeliveryZoneModal";
import AddressSetupCard from "@/components/delivery/AddressSetupCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the BusinessAddress interface to be used throughout the component
export interface BusinessAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
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
  const [businessAddress, setBusinessAddress] = useState<BusinessAddress | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [defaultRadius, setDefaultRadius] = useState<string>("5");
  const [defaultFee, setDefaultFee] = useState<string>("5.00");
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

    // Load default delivery settings
    try {
      const savedDefaults = localStorage.getItem("deliveryDefaults");
      if (savedDefaults) {
        const defaults = JSON.parse(savedDefaults);
        setDefaultRadius(defaults.radius || "5");
        setDefaultFee(defaults.fee || "5.00");
      }
    } catch (error) {
      console.error("Error loading delivery defaults:", error);
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

  // Save default settings
  const handleSaveDefaults = () => {
    const defaults = {
      radius: defaultRadius,
      fee: defaultFee,
    };
    localStorage.setItem("deliveryDefaults", JSON.stringify(defaults));
    toast({
      title: "Configurações salvas",
      description: "As configurações padrão de entrega foram salvas com sucesso.",
    });
  };

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

  // Handle deleting a delivery zone with confirmation
  const handleDeleteZone = (id: string, zoneName: string) => {
    setZones(zones.filter((zone) => zone.id !== id));
    toast({
      title: "Zona removida",
      description: `A zona de entrega "${zoneName}" foi removida com sucesso.`,
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
            zipCode: businessAddress.postalCode,
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

        {/* Default Delivery Settings */}
        {businessAddress && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações Padrão de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultRadius">Raio Padrão de Entrega (km)</Label>
                  <Input
                    id="defaultRadius"
                    type="number"
                    min="0"
                    step="0.1"
                    value={defaultRadius}
                    onChange={(e) => setDefaultRadius(e.target.value)}
                    placeholder="Ex: 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultFee">Taxa Padrão de Entrega (R$)</Label>
                  <Input
                    id="defaultFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={defaultFee}
                    onChange={(e) => setDefaultFee(e.target.value)}
                    placeholder="Ex: 5.00"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={handleSaveDefaults} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a zona de entrega "{zone.name}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteZone(zone.id, zone.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
            defaultRadius={parseFloat(defaultRadius)}
            defaultFee={parseFloat(defaultFee)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DeliveryAreas;
