
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, MapPin, Clock, DollarSign, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BusinessAddress } from "@/pages/delivery/DeliveryAreas";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeliveryRadiusMapProps {
  address: BusinessAddress | null;
  onSave: (radius: string, fee: string) => void;
}

const DeliveryRadiusMap: React.FC<DeliveryRadiusMapProps> = ({ address, onSave }) => {
  const [deliveryRadius, setDeliveryRadius] = useState<string>("5");
  const [deliveryFee, setDeliveryFee] = useState<string>("5.00");
  const [estimatedTime, setEstimatedTime] = useState<string>("30-45");
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();

  // Load saved settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("deliverySettings");
      const savedToken = localStorage.getItem("mapboxToken");
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDeliveryRadius(settings.radius || "5");
        setDeliveryFee(settings.fee || "5.00");
        setEstimatedTime(settings.estimatedTime || "30-45");
      }
      
      if (savedToken) {
        setMapboxToken(savedToken);
      }
    } catch (error) {
      console.error("Error loading delivery settings:", error);
    }
  }, []);

  // Initialize map when token and address are available
  useEffect(() => {
    if (!mapboxToken || !address || !mapContainer.current || isMapLoaded) return;

    mapboxgl.accessToken = mapboxToken;

    // Geocode the address to get coordinates
    const geocodeAddress = async () => {
      try {
        const addressString = getAddressString();
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressString)}.json?access_token=${mapboxToken}&limit=1`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          initializeMap(lng, lat);
          setIsMapLoaded(true);
        } else {
          toast({
            title: "Endereço não encontrado",
            description: "Não foi possível localizar o endereço no mapa.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
        toast({
          title: "Erro no mapa",
          description: "Erro ao carregar o mapa. Verifique o token do Mapbox.",
          variant: "destructive",
        });
      }
    };

    const initializeMap = (lng: number, lat: number) => {
      if (map.current) {
        map.current.remove();
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 13,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add marker for business location
      new mapboxgl.Marker({ 
        color: '#ef4444',
        scale: 1.2 
      })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <strong>📍 Localização da Empresa</strong><br/>
            <small>${getAddressString()}</small>
          </div>
        `))
        .addTo(map.current);

      // Add delivery radius circle
      map.current.on('load', () => {
        addDeliveryRadius(lng, lat);
      });
    };

    geocodeAddress();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setIsMapLoaded(false);
    };
  }, [mapboxToken, address]);

  // Update delivery radius when changed
  useEffect(() => {
    if (map.current && isMapLoaded && address) {
      updateDeliveryRadius();
    }
  }, [deliveryRadius, isMapLoaded]);

  const updateDeliveryRadius = async () => {
    if (!map.current || !address) return;

    try {
      const addressString = getAddressString();
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressString)}.json?access_token=${mapboxToken}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        addDeliveryRadius(lng, lat);
      }
    } catch (error) {
      console.error("Error updating radius:", error);
    }
  };

  const addDeliveryRadius = (lng: number, lat: number) => {
    if (!map.current) return;

    const radiusInKm = parseFloat(deliveryRadius);
    
    // Remove existing radius layers
    if (map.current.getLayer('delivery-radius-fill')) {
      map.current.removeLayer('delivery-radius-fill');
    }
    if (map.current.getLayer('delivery-radius-border')) {
      map.current.removeLayer('delivery-radius-border');
    }
    if (map.current.getSource('delivery-radius')) {
      map.current.removeSource('delivery-radius');
    }

    // Create a circle using turf-like approach
    const createCircle = (center: [number, number], radiusKm: number, points = 64) => {
      const coords = [];
      const distanceX = radiusKm / (111.320 * Math.cos((center[1] * Math.PI) / 180));
      const distanceY = radiusKm / 110.540;

      for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        coords.push([center[0] + x, center[1] + y]);
      }
      coords.push(coords[0]); // Close the polygon

      return {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'Polygon' as const,
          coordinates: [coords],
        },
      };
    };

    const circleFeature = createCircle([lng, lat], radiusInKm);

    map.current.addSource('delivery-radius', {
      type: 'geojson',
      data: circleFeature,
    });

    map.current.addLayer({
      id: 'delivery-radius-fill',
      type: 'fill',
      source: 'delivery-radius',
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.2,
      },
    });

    map.current.addLayer({
      id: 'delivery-radius-border',
      type: 'line',
      source: 'delivery-radius',
      paint: {
        'line-color': '#3b82f6',
        'line-width': 2,
        'line-opacity': 0.8,
      },
    });
  };

  const handleSave = () => {
    const settings = {
      radius: deliveryRadius,
      fee: deliveryFee,
      estimatedTime: estimatedTime,
    };
    localStorage.setItem("deliverySettings", JSON.stringify(settings));
    localStorage.setItem("mapboxToken", mapboxToken);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Configuração do Raio de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token do Mapbox */}
        <div className="space-y-2">
          <Label htmlFor="mapboxToken">Token do Mapbox (Obrigatório)</Label>
          <Input
            id="mapboxToken"
            type="text"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Insira seu token público do Mapbox"
          />
          <div className="text-xs text-muted-foreground">
            <p>Você pode obter seu token público gratuito em:</p>
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://mapbox.com/
            </a>
          </div>
        </div>

        {!mapboxToken && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Para visualizar o mapa interativo, você precisa inserir um token do Mapbox. 
              É gratuito e permite até 50.000 visualizações por mês.
            </AlertDescription>
          </Alert>
        )}

        {address && (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Endereço base para entrega:</p>
              <p className="text-sm text-muted-foreground">{getAddressString()}</p>
            </div>

            {/* Mapa Interativo */}
            {mapboxToken && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Mapa Interativo</span>
                </div>
                <div 
                  ref={mapContainer}
                  className="w-full h-80 rounded-lg border border-border"
                  style={{ minHeight: '320px' }}
                />
                <div className="flex items-center justify-center gap-4 bg-blue-50 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-blue-700">Localização da Empresa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-700">Área de Entrega: {deliveryRadius}km</span>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder quando não há token */}
            {!mapboxToken && (
              <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-blue-200 rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <div className="space-y-2">
                  <p className="font-medium text-blue-700">Mapa Interativo</p>
                  <p className="text-sm text-blue-600">
                    Insira o token do Mapbox acima para visualizar o mapa com o raio de entrega de <strong>{deliveryRadius}km</strong>
                  </p>
                </div>
              </div>
            )}

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
