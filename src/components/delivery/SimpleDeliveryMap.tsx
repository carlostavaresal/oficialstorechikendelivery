import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, MapPin, Clock, DollarSign, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BusinessAddress } from "@/pages/delivery/DeliveryAreas";

interface SimpleDeliveryMapProps {
  address: BusinessAddress | null;
  onSave: (radius: string, fee: string) => void;
}

const SimpleDeliveryMap: React.FC<SimpleDeliveryMapProps> = ({ address, onSave }) => {
  const [deliveryRadius, setDeliveryRadius] = useState<string>("5");
  const [deliveryFee, setDeliveryFee] = useState<string>("5.00");
  const [estimatedTime, setEstimatedTime] = useState<string>("30-45");
  const { toast } = useToast();

  // Load saved settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("deliverySettings");
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDeliveryRadius(settings.radius || "5");
        setDeliveryFee(settings.fee || "5.00");
        setEstimatedTime(settings.estimatedTime || "30-45");
      }
    } catch (error) {
      console.error("Error loading delivery settings:", error);
    }
  }, []);

  const handleSave = () => {
    const settings = {
      radius: deliveryRadius,
      fee: deliveryFee,
      estimatedTime: estimatedTime,
    };
    localStorage.setItem("deliverySettings", JSON.stringify(settings));
    onSave(deliveryRadius, deliveryFee);
    
    toast({
      title: "Configurações salvas",
      description: `Raio de ${deliveryRadius}km, taxa de € ${deliveryFee} e tempo de ${estimatedTime} min salvos.`,
    });
  };

  const getAddressString = () => {
    if (!address) return "";
    return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}`;
  };

  const openGoogleMaps = () => {
    if (!address) return;
    const fullAddress = `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, Brasil`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    window.open(googleMapsUrl, '_blank');
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
        {/* Indicador de configuração simples */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            📍 Configuração Simplificada
          </h4>
          <p className="text-blue-700 text-sm">
            Configure o raio de entrega e taxas. Para visualizar no mapa, use o botão "Ver no Google Maps".
          </p>
        </div>

        {address && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium mb-2">Endereço base para entrega:</p>
              <p className="text-sm text-muted-foreground mb-3">{getAddressString()}</p>
              <Button
                onClick={openGoogleMaps}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                Ver no Google Maps
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            {/* Visualização da área de entrega */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  🍗 Store Chicken - Área de Entrega
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>📍 Restaurante</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>🚚 Raio: {deliveryRadius}km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰 Taxa: € {deliveryFee}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryRadius" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Raio de Entrega (km)
                </Label>
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
                  Distância máxima para entrega
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryFee" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Taxa de Entrega (€)
                </Label>
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
                  Valor cobrado pela entrega
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Tempo Estimado (min)
                </Label>
                <Input
                  id="estimatedTime"
                  type="text"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="Ex: 30-45"
                />
                <p className="text-xs text-muted-foreground">
                  Tempo de entrega estimado
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

export default SimpleDeliveryMap;