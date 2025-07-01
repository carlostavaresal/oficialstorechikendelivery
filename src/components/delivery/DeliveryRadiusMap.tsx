
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BusinessAddress } from "@/pages/delivery/DeliveryAreas";

interface DeliveryRadiusMapProps {
  address: BusinessAddress | null;
  onSave: (radius: string, fee: string) => void;
}

const DeliveryRadiusMap: React.FC<DeliveryRadiusMapProps> = ({ address, onSave }) => {
  const [deliveryRadius, setDeliveryRadius] = useState<string>("5");
  const [deliveryFee, setDeliveryFee] = useState<string>("5.00");
  const { toast } = useToast();

  // Load saved settings
  useEffect(() => {
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

  const handleSave = () => {
    const settings = {
      radius: deliveryRadius,
      fee: deliveryFee,
    };
    localStorage.setItem("deliverySettings", JSON.stringify(settings));
    onSave(deliveryRadius, deliveryFee);
    
    toast({
      title: "Configurações salvas",
      description: "Raio de entrega e taxa foram salvos com sucesso.",
    });
  };

  const getAddressString = () => {
    if (!address) return "";
    return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}`;
  };

  const getMapUrl = () => {
    if (!address) return "";
    const addressString = encodeURIComponent(getAddressString());
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${addressString}&zoom=15`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Configuração do Raio de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {address && (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Endereço base para entrega:</p>
              <p className="text-sm text-muted-foreground">{getAddressString()}</p>
            </div>

            {/* Placeholder para o mapa - Em produção seria um mapa real */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-blue-200 rounded-lg p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <div className="space-y-2">
                <p className="font-medium text-blue-700">Visualização do Mapa</p>
                <p className="text-sm text-blue-600">
                  Aqui seria exibido um mapa interativo mostrando o raio de entrega de <strong>{deliveryRadius}km</strong> 
                  a partir do endereço configurado
                </p>
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-blue-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-700">Área de Entrega: {deliveryRadius}km</span>
                </div>
              </div>
            </div>

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
                <p className="text-xs text-muted-foreground">
                  Distância máxima para entrega a partir do seu endereço
                </p>
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
                <p className="text-xs text-muted-foreground">
                  Valor cobrado pela entrega dentro do raio configurado
                </p>
              </div>
            </div>

            <Button onClick={handleSave} className="flex items-center gap-2 w-full">
              <Save className="h-4 w-4" />
              Salvar Configurações de Entrega
            </Button>
          </div>
        )}

        {!address && (
          <div className="text-center p-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Configure o endereço primeiro</p>
            <p className="text-sm">
              Para definir o raio de entrega, você precisa primeiro configurar o endereço da sua empresa na seção acima.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryRadiusMap;
