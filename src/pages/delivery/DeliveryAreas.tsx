import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, MapPin, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import DeliveryZoneModal from "@/components/delivery/DeliveryZoneModal";
import AddressSetupCard from "@/components/delivery/AddressSetupCard";

export interface DeliveryZone {
  id: string;
  name: string;
  distanceKm: number;
  fee: number;
  estimatedTime: string;
  color: string;
}

const DeliveryAreas = () => {
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [companyAddress, setCompanyAddress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });
  
  // Load saved zones on component mount
  useEffect(() => {
    const savedZones = localStorage.getItem("deliveryZones");
    if (savedZones) {
      setZones(JSON.parse(savedZones));
    }
    
    const savedAddress = localStorage.getItem("companyAddress");
    if (savedAddress) {
      setCompanyAddress(JSON.parse(savedAddress));
    }
  }, []);
  
  const handleEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setShowAddModal(true);
  };
  
  const handleDeleteZone = (zoneId: string) => {
    const updatedZones = zones.filter(z => z.id !== zoneId);
    setZones(updatedZones);
    localStorage.setItem("deliveryZones", JSON.stringify(updatedZones));
    
    toast({
      title: "Zona removida",
      description: "A área de entrega foi removida com sucesso.",
    });
  };
  
  const handleAddressUpdate = (address: typeof companyAddress) => {
    setCompanyAddress(address);
    localStorage.setItem("companyAddress", JSON.stringify(address));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Áreas de Entrega</h2>
            <p className="text-muted-foreground">
              Configure as áreas de entrega e os valores cobrados por região
            </p>
          </div>
          <Button onClick={() => { setEditingZone(null); setShowAddModal(true); }}>
            <Plus className="mr-2" />
            Adicionar Zona
          </Button>
        </div>
        <Separator />
        
        <AddressSetupCard 
          address={companyAddress}
          onAddressUpdate={handleAddressUpdate}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Zonas de Entrega</CardTitle>
            <CardDescription>
              Defina as zonas de entrega e as taxas cobradas por distância
            </CardDescription>
          </CardHeader>
          <CardContent>
            {zones.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-md bg-muted/50">
                <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma zona de entrega configurada
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => { setEditingZone(null); setShowAddModal(true); }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar zona
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: zone.color || '#3B82F6' }} 
                      />
                      <div>
                        <h3 className="font-medium">{zone.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Até {zone.distanceKm} km • {formatCurrency(zone.fee)} • ~{zone.estimatedTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditZone(zone)}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <DeliveryZoneModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        existingZone={editingZone}
        onSave={(zone) => {
          if (editingZone) {
            // Update existing zone
            const updatedZones = zones.map(z => 
              z.id === zone.id ? zone : z
            );
            setZones(updatedZones);
            localStorage.setItem("deliveryZones", JSON.stringify(updatedZones));
            toast({
              title: "Zona atualizada",
              description: `A zona "${zone.name}" foi atualizada com sucesso.`,
            });
          } else {
            // Add new zone
            const newZones = [...zones, zone];
            setZones(newZones);
            localStorage.setItem("deliveryZones", JSON.stringify(newZones));
            toast({
              title: "Zona adicionada",
              description: `A zona "${zone.name}" foi adicionada com sucesso.`,
            });
          }
          setEditingZone(null);
        }}
      />
    </DashboardLayout>
  );
};

export default DeliveryAreas;
