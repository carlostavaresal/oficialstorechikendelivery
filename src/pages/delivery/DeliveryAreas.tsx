
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

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

// Use simple delivery map instead of complex Leaflet component to avoid dependency issues
const AddressSetupCard = React.lazy(() => import("@/components/delivery/AddressSetupCard"));
const SimpleDeliveryMap = React.lazy(() => import("@/components/delivery/SimpleDeliveryMap"));
const GoogleMapsLink = React.lazy(() => import("@/components/delivery/GoogleMapsLink"));


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
      description: `Raio de ${radius}km e taxa de € ${fee} foram salvos.`,
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
        
        <React.Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          {/* Business Address Setup */}
          <div className="space-y-4">
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
            
            {businessAddress && (
              <div className="flex justify-end">
                <GoogleMapsLink address={businessAddress} />
              </div>
            )}
          </div>

          {/* Simple Delivery Configuration */}
          <SimpleDeliveryMap
            address={businessAddress}
            onSave={handleSaveDeliverySettings}
          />
        </React.Suspense>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryAreas;
