
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, MapPin, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BusinessAddress } from "@/pages/delivery/DeliveryAreas";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DeliveryRadiusMapProps {
  address: BusinessAddress | null;
  onSave: (radius: string, fee: string) => void;
}

const DeliveryRadiusMap: React.FC<DeliveryRadiusMapProps> = ({ address, onSave }) => {
  const [deliveryRadius, setDeliveryRadius] = useState<string>("5");
  const [deliveryFee, setDeliveryFee] = useState<string>("5.00");
  const [estimatedTime, setEstimatedTime] = useState<string>("30-45");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
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

  // Get coordinates from address using free geocoding (OpenStreetMap)
  const getCoordinatesFromAddress = async (address: BusinessAddress): Promise<[number, number] | null> => {
    try {
      setIsLoadingLocation(true);
      const fullAddress = `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, Brasil`;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=br`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Load coordinates when address changes
  useEffect(() => {
    if (!address) {
      setCoordinates(null);
      return;
    }

    const loadCoordinates = async () => {
      const coords = await getCoordinatesFromAddress(address);
      if (coords) {
        setCoordinates(coords);
        toast({
          title: "Localização encontrada",
          description: "Endereço localizado no mapa com sucesso!",
        });
      } else {
        toast({
          title: "Localização não encontrada",
          description: "Não foi possível localizar o endereço no mapa. Verifique se está correto.",
          variant: "destructive",
        });
      }
    };

    loadCoordinates();
  }, [address, toast]);


  const handleSave = () => {
    if (!coordinates) {
      toast({
        title: "Localização necessária",
        description: "Localize primeiro o endereço no mapa.",
        variant: "destructive",
      });
      return;
    }

    const settings = {
      radius: deliveryRadius,
      fee: deliveryFee,
      estimatedTime: estimatedTime,
    };
    localStorage.setItem("deliverySettings", JSON.stringify(settings));
    onSave(deliveryRadius, deliveryFee);
    
    toast({
      title: "Configurações salvas",
      description: `Raio de ${deliveryRadius}km, taxa de R$ ${deliveryFee} e tempo de ${estimatedTime} min salvos.`,
    });
  };

  const getAddressString = () => {
    if (!address) return "";
    return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}`;
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
        {/* Indicador de mapa gratuito */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            🎉 Mapa Gratuito Ativado!
          </h4>
          <p className="text-green-700 text-sm">
            Este mapa usa OpenStreetMap - totalmente gratuito, sem necessidade de token, cartão de crédito ou cadastro!
          </p>
        </div>

        {address && (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Endereço base para entrega:</p>
              <p className="text-sm text-muted-foreground">{getAddressString()}</p>
            </div>

            {/* Mapa Interativo Gratuito */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Mapa Interativo - Store Chicken</span>
              </div>
              
              <div className="h-80 rounded-lg border overflow-hidden">
                {isLoadingLocation ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Localizando endereço...</p>
                    </div>
                  </div>
                ) : coordinates ? (
                  <MapContainer
                    center={coordinates}
                    zoom={14}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Business location marker */}
                    <Marker position={coordinates}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-red-600">🍗 Store Chicken</h3>
                          <p className="text-sm">
                            {address?.street}, {address?.number}<br/>
                            {address?.neighborhood}<br/>
                            {address?.city} - {address?.state}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            📍 Localização da empresa
                          </p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Delivery radius circle */}
                    <Circle
                      center={coordinates}
                      radius={parseFloat(deliveryRadius) * 1000} // Convert km to meters
                      pathOptions={{
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.2,
                        weight: 2,
                      }}
                    />
                  </MapContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Não foi possível localizar o endereço
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Verifique se o endereço está correto
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-4 bg-blue-50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-blue-700">🍗 Store Chicken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-700">Área de Entrega: {deliveryRadius}km</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-700">Taxa: R$ {deliveryFee}</span>
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
                  Taxa de Entrega (R$)
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

export default DeliveryRadiusMap;
