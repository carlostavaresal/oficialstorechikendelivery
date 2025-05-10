
// Fix for the BusinessAddress type mismatch
// Add a proper interface for the address that matches the DeliveryZoneModal props

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Plus, AlertCircle } from 'lucide-react';
import DeliveryZoneModal from '@/components/delivery/DeliveryZoneModal';
import AddressSetupCard from '@/components/delivery/AddressSetupCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the interface for the Business Address that matches the one in DeliveryZoneModal
export interface BusinessAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string; // This is used as zipCode when sending to the modal
  complement?: string;
}

// Define the delivery zone type
export interface DeliveryZone {
  id: string;
  name: string;
  radius: number;
  fee: number;
  minTime: number;
  maxTime: number;
  active: boolean;
}

const DeliveryAreas: React.FC = () => {
  const [businessAddress, setBusinessAddress] = useState<BusinessAddress | null>(null);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([
    {
      id: "zone-1",
      name: "Centro",
      radius: 3,
      fee: 5.00,
      minTime: 15,
      maxTime: 30,
      active: true,
    },
    {
      id: "zone-2",
      name: "Zona Sul",
      radius: 5,
      fee: 7.50,
      minTime: 20,
      maxTime: 40,
      active: false,
    },
  ]);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [showAddressAlert, setShowAddressAlert] = useState(false);

  const handleSetBusinessAddress = (address: BusinessAddress) => {
    // Convert between different address interfaces
    const adaptedAddress = {
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.postalCode, // Map from postalCode to zipCode
    };
    
    setBusinessAddress(address);
    setShowAddressAlert(false);
  };

  const handleAddDeliveryZone = () => {
    if (!businessAddress) {
      setShowAddressAlert(true);
      return;
    }
    
    setSelectedZone(null);
    setShowZoneModal(true);
  };

  const handleEditDeliveryZone = (zone: DeliveryZone) => {
    setSelectedZone(zone);
    setShowZoneModal(true);
  };

  const handleSaveDeliveryZone = (zone: DeliveryZone) => {
    if (!zone.name || !zone.radius || !zone.fee || !zone.minTime || !zone.maxTime) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (zone.radius <= 0 || zone.fee < 0 || zone.minTime < 0 || zone.maxTime < 0) {
      alert("Os valores devem ser positivos.");
      return;
    }

    if (zone.minTime > zone.maxTime) {
      alert("O tempo mínimo não pode ser maior que o tempo máximo.");
      return;
    }

    setDeliveryZones([...deliveryZones, zone]);
    setShowZoneModal(false);
  };

  const handleUpdateDeliveryZone = (updatedZone: DeliveryZone) => {
    if (!updatedZone.name || !updatedZone.radius || !updatedZone.fee || !updatedZone.minTime || !updatedZone.maxTime) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (updatedZone.radius <= 0 || updatedZone.fee < 0 || updatedZone.minTime < 0 || updatedZone.maxTime < 0) {
      alert("Os valores devem ser positivos.");
      return;
    }

    if (updatedZone.minTime > updatedZone.maxTime) {
      alert("O tempo mínimo não pode ser maior que o tempo máximo.");
      return;
    }

    setDeliveryZones(
      deliveryZones.map((zone) =>
        zone.id === updatedZone.id ? updatedZone : zone
      )
    );
    setShowZoneModal(false);
  };

  const handleDeleteDeliveryZone = (zoneId: string) => {
    setDeliveryZones(deliveryZones.filter((zone) => zone.id !== zoneId));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Áreas de Entrega
          </h2>
          <p className="text-muted-foreground">
            Configure as áreas de entrega e taxas para cada região.
          </p>
        </div>
        <Separator />

        {!businessAddress && showAddressAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Endereço não configurado.</AlertTitle>
            <AlertDescription>
              Por favor, configure o endereço da sua empresa para calcular as
              áreas de entrega.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <AddressSetupCard
            address={businessAddress}
            onAddressSet={handleSetBusinessAddress}
          />

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Zonas de Entrega</CardTitle>
                <CardDescription>
                  Gerencie as zonas de entrega e taxas para cada região.
                </CardDescription>
                <Button onClick={handleAddDeliveryZone}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Zona
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveryZones.length === 0 ? (
                <p className="text-muted-foreground">
                  Nenhuma zona de entrega configurada.
                </p>
              ) : (
                <div className="grid gap-4">
                  {deliveryZones.map((zone) => (
                    <Card key={zone.id} className="shadow-sm">
                      <CardHeader>
                        <CardTitle>{zone.name}</CardTitle>
                        <CardDescription>
                          Raio: {zone.radius}km | Taxa: R$ {zone.fee.toFixed(2)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        Tempo estimado: {zone.minTime} - {zone.maxTime} minutos
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDeliveryZone(zone)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDeliveryZone(zone.id)}
                        >
                          Excluir
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showZoneModal && (
        <DeliveryZoneModal
          isOpen={showZoneModal}
          onClose={() => setShowZoneModal(false)}
          zone={selectedZone}
          businessAddress={businessAddress ? {
            street: businessAddress.street,
            number: businessAddress.number,
            neighborhood: businessAddress.neighborhood,
            city: businessAddress.city,
            state: businessAddress.state,
            zipCode: businessAddress.postalCode, // Correctly map postalCode to zipCode
            complement: businessAddress.complement
          } : null}
        />
      )}
    </DashboardLayout>
  );
};

export default DeliveryAreas;
