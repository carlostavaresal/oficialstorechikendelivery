
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddressSetupCard from "@/components/delivery/AddressSetupCard";

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

const DeliveryAreas: React.FC = () => {
  const [businessAddress, setBusinessAddress] = useState<BusinessAddress | null>(null);
  const [deliveryRadius, setDeliveryRadius] = useState<string>("5");
  const [deliveryFee, setDeliveryFee] = useState<string>("5.00");
  const { toast } = useToast();

  // Load business address and delivery settings when component mounts
  useEffect(() => {
    try {
      const savedAddress = localStorage.getItem("businessAddress");
      if (savedAddress) {
        setBusinessAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error("Error loading business address:", error);
    }

    try {
      const savedSettings = localStorage.getItem("deliverySettings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDeliveryRadius(settings.radius || "5");
        setDeliveryFee(settings.fee || "5.00");
      }
    } catch (error) {
      console.error("Error loading delivery settings:", error);
    }
  }, []);

  // Save business address to localStorage whenever it changes
  useEffect(() => {
    if (businessAddress) {
      localStorage.setItem("businessAddress", JSON.stringify(businessAddress));
    }
  }, [businessAddress]);

  // Save delivery settings
  const handleSaveSettings = () => {
    const settings = {
      radius: deliveryRadius,
      fee: deliveryFee,
    };
    localStorage.setItem("deliverySettings", JSON.stringify(settings));
    toast({
      title: "Configurações salvas",
      description: "As configurações de entrega foram salvas com sucesso.",
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

        {/* Delivery Settings */}
        {businessAddress && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryRadius">Raio de Entrega (km)</Label>
                  <Input
                    id="deliveryRadius"
                    type="number"
                    min="0"
                    step="0.1"
                    value={deliveryRadius}
                    onChange={(e) => setDeliveryRadius(e.target.value)}
                    placeholder="Ex: 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    placeholder="Ex: 5.00"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DeliveryAreas;
