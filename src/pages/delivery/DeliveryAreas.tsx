
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import AddressSetupCard from "@/components/delivery/AddressSetupCard";
import DeliveryRadiusMap from "@/components/delivery/DeliveryRadiusMap";

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
  const { toast } = useToast();

  // Load business address when component mounts
  useEffect(() => {
    try {
      const savedAddress = localStorage.getItem("businessAddress");
      if (savedAddress) {
        setBusinessAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error("Error loading business address:", error);
    }
  }, []);

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

  // Handler for saving delivery settings
  const handleSaveDeliverySettings = (radius: string, fee: string) => {
    toast({
      title: "Configurações salvas",
      description: `Raio de ${radius}km e taxa de R$ ${fee} foram salvos.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Áreas de Entrega</h1>
          <p className="text-muted-foreground">
            Configure o endereço da sua empresa e defina o raio de entregas com as respectivas taxas.
          </p>
        </div>
        
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

        {/* Delivery Radius Map */}
        <DeliveryRadiusMap
          address={businessAddress}
          onSave={handleSaveDeliverySettings}
        />
      </div>
    </DashboardLayout>
  );
};

export default DeliveryAreas;
