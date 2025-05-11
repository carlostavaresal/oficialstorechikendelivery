
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Check } from "lucide-react";
import { BusinessAddress } from "@/pages/delivery/DeliveryAreas";

interface AddressSetupCardProps {
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
  };
  onAddressUpdate: (address: BusinessAddress) => void;
}

const AddressSetupCard: React.FC<AddressSetupCardProps> = ({
  address,
  onAddressUpdate,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ...address,
    postalCode: address.zipCode || '',  // Map zipCode to postalCode for internal use
  });
  const [isEditing, setIsEditing] = useState(!address.street);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all required fields are filled
    if (!formData.street || !formData.number || !formData.city || !formData.state) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    onAddressUpdate({
      street: formData.street,
      number: formData.number,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      complement: formData.complement
    });
    
    setIsEditing(false);
  };

  const isFormComplete = formData.street && formData.number && formData.city && formData.state;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço da Empresa</CardTitle>
        <CardDescription>
          Defina o endereço de origem para calcular as áreas de entrega
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing && address.street ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-medium">
                  {address.street}, {address.number}
                  {address.neighborhood && `, ${address.neighborhood}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.city} - {address.state}
                  {address.zipCode && `, ${address.zipCode}`}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Editar endereço
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Nome da rua"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder="Nome do bairro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Nome da cidade"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="UF"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">CEP</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  name="complement"
                  value={formData.complement || ''}
                  onChange={handleChange}
                  placeholder="Apto, sala, etc."
                />
              </div>
            </div>
            <div className="flex justify-end">
              {address.street && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={!isFormComplete}
                className="flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Salvar Endereço
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressSetupCard;
