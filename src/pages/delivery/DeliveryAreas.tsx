
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DeliveryZoneModal from "@/components/delivery/DeliveryZoneModal";
import AddressSetupCard from "@/components/delivery/AddressSetupCard";

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  radius: number;
  deliveryFee: number;
  minOrderValue: number;
  active: boolean;
}

const DeliveryAreas = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentZone, setCurrentZone] = useState<DeliveryZone | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load zones from localStorage
    const savedZones = localStorage.getItem("deliveryZones");
    if (savedZones) {
      setZones(JSON.parse(savedZones));
    }
  }, []);

  const saveZones = (updatedZones: DeliveryZone[]) => {
    setZones(updatedZones);
    localStorage.setItem("deliveryZones", JSON.stringify(updatedZones));
  };

  const handleOpenModal = (zone?: DeliveryZone) => {
    if (zone) {
      setCurrentZone(zone);
    } else {
      setCurrentZone(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveZone = (zone: DeliveryZone) => {
    if (currentZone) {
      // Update existing zone
      const updatedZones = zones.map(z => 
        z.id === zone.id ? zone : z
      );
      saveZones(updatedZones);
      toast({
        title: "Zona de entrega atualizada",
        description: `${zone.name} foi atualizada com sucesso.`
      });
    } else {
      // Add new zone
      const newZone = {
        ...zone,
        id: `zone-${Date.now()}`
      };
      saveZones([...zones, newZone]);
      toast({
        title: "Zona de entrega criada",
        description: `${newZone.name} foi adicionada com sucesso.`
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentZone) {
      const filteredZones = zones.filter(zone => zone.id !== currentZone.id);
      saveZones(filteredZones);
      toast({
        title: "Zona de entrega removida",
        description: `${currentZone.name} foi removida com sucesso.`
      });
      setIsDeleteDialogOpen(false);
      setCurrentZone(null);
    }
  };

  const handleOpenDeleteDialog = (zone: DeliveryZone) => {
    setCurrentZone(zone);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Áreas de Entrega</h2>
            <p className="text-muted-foreground">
              Gerencie as regiões onde seu delivery atende e as taxas de entrega
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2" />
            Nova Área
          </Button>
        </div>

        <Separator />
        
        <div className="grid grid-cols-1 gap-6">
          <AddressSetupCard />
          
          {zones.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-center">
                  Nenhuma zona de entrega cadastrada.<br />
                  Adicione suas áreas de entrega para começar.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {zones.map(zone => (
                <Card key={zone.id} className={zone.active ? "border-green-200" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{zone.name}</CardTitle>
                      {zone.active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">
                          Inativa
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{zone.description || "Sem descrição"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Raio:</span>
                        <span className="font-medium">{zone.radius} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa:</span>
                        <span className="font-medium">{formatCurrency(zone.deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pedido mínimo:</span>
                        <span className="font-medium">{formatCurrency(zone.minOrderValue)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(zone)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(zone)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <DeliveryZoneModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveZone}
        zone={currentZone || undefined}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a área de entrega "{currentZone?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DeliveryAreas;
