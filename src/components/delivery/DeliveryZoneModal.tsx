
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MapPin, Navigation } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { DeliveryZone } from "@/pages/delivery/DeliveryAreas";

// Interface for the business address
interface BusinessAddressProps {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

interface DeliveryZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: DeliveryZone | null;
  businessAddress: BusinessAddressProps | null;
  onSave: (zone: DeliveryZone) => void;
}

const DeliveryZoneModal: React.FC<DeliveryZoneModalProps> = ({ 
  isOpen, 
  onClose, 
  zone, 
  businessAddress,
  onSave 
}) => {
  // Using default values for a new zone if none is provided
  const defaultZone: DeliveryZone = {
    id: "",
    name: "",
    radius: 3,
    fee: 5.00,
    minTime: 15,
    maxTime: 30,
    active: true
  };

  // Form state based on the zone prop or default values
  const [formData, setFormData] = useState<DeliveryZone>(zone || defaultZone);

  // Update form when zone prop changes
  useEffect(() => {
    if (zone) {
      setFormData(zone);
    } else {
      setFormData(defaultZone);
    }
  }, [zone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    // Handle different input types appropriately
    const parsedValue = type === 'number' ? 
      (value === '' ? '' : parseFloat(value)) : 
      value;

    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Calculate pricing based on radius
  const calculateFeeByRadius = () => {
    const baseRate = 3.0;  // Base delivery fee in currency units
    const ratePerKm = 1.0;  // Additional fee per kilometer
    
    const calculatedFee = baseRate + (formData.radius * ratePerKm);
    
    // Update form data with calculated fee
    setFormData({
      ...formData,
      fee: parseFloat(calculatedFee.toFixed(2))
    });
  };

  // Calculate delivery time based on radius
  const calculateDeliveryTime = () => {
    const baseMinTime = 10;  // Minimum delivery time in minutes
    const baseMaxTime = 20;  // Base maximum delivery time
    const timePerKm = 2;     // Additional minutes per kilometer
    
    const minTime = baseMinTime + Math.floor(formData.radius * timePerKm * 0.8);
    const maxTime = baseMaxTime + Math.floor(formData.radius * timePerKm * 1.2);
    
    // Update form data with calculated times
    setFormData({
      ...formData,
      minTime,
      maxTime
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {zone ? "Editar zona de entrega" : "Adicionar nova zona de entrega"}
          </DialogTitle>
          <DialogDescription>
            Configure os detalhes da zona de entrega a partir do seu endereço
          </DialogDescription>
        </DialogHeader>

        {businessAddress ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  Endereço base: {businessAddress.street}, {businessAddress.number} - {businessAddress.city}/{businessAddress.state}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Zona</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Centro, Zona Sul, etc."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="radius">Raio (km)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="radius"
                      name="radius"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="5"
                      value={formData.radius}
                      onChange={handleChange}
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={calculateFeeByRadius}
                      className="whitespace-nowrap"
                    >
                      Calcular Taxa
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fee">Taxa de Entrega (R$)</Label>
                  <Input
                    id="fee"
                    name="fee"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="5.00"
                    value={formData.fee}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minTime">Tempo Mínimo (min)</Label>
                  <Input
                    id="minTime"
                    name="minTime"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="15"
                    value={formData.minTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxTime">Tempo Máximo (min)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="maxTime"
                      name="maxTime"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="30"
                      value={formData.maxTime}
                      onChange={handleChange}
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={calculateDeliveryTime}
                      className="whitespace-nowrap"
                    >
                      Estimar Tempo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {zone ? "Atualizar Zona" : "Criar Zona"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-amber-50 p-4 text-amber-800">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Endereço não configurado</h3>
              </div>
              <p className="text-sm mt-2">
                Configure o endereço da sua empresa para poder adicionar zonas de entrega.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" onClick={onClose}>
                Entendi
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryZoneModal;
