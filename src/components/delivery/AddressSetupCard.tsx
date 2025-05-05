
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Check } from "lucide-react";

interface AddressSetupCardProps {
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onAddressUpdate: (address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  }) => void;
}

const AddressSetupCard: React.FC<AddressSetupCardProps> = ({
  address,
  onAddressUpdate,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(address);
  const [isEditing, setIsEditing] = useState(!address.street);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddressUpdate(formData);
    setIsEditing(false);
    toast({
      title: "Endereço atualizado",
      description: "O endereço da empresa foi atualizado com sucesso.",
    });
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
        {!isEditing ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-medium">
                  {formData.street}, {formData.number}
                  {formData.neighborhood && `, ${formData.neighborhood}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.city} - {formData.state}
                  {formData.zipCode && `, ${formData.zipCode}`}
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
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="00000-000"
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
