
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DeliveryZone } from "@/pages/delivery/DeliveryAreas";

// Define the form schema with validation
const deliveryZoneSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  distanceKm: z.coerce.number().positive("Distância deve ser um valor positivo"),
  fee: z.coerce.number().min(0, "Taxa não pode ser negativa"),
  estimatedTime: z.string().min(2, "Tempo estimado deve ser informado"),
  color: z.string().min(4, "Cor deve ser informada"),
});

interface DeliveryZoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingZone: DeliveryZone | null;
  onSave: (zone: DeliveryZone) => void;
}

const DeliveryZoneModal: React.FC<DeliveryZoneModalProps> = ({ 
  open, 
  onOpenChange, 
  existingZone, 
  onSave 
}) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof deliveryZoneSchema>>({
    resolver: zodResolver(deliveryZoneSchema),
    defaultValues: existingZone || {
      name: "",
      distanceKm: 5,
      fee: 5,
      estimatedTime: "20-30 min",
      color: "#3B82F6",
    },
  });

  // Update form values when editing a zone
  React.useEffect(() => {
    if (existingZone) {
      form.reset(existingZone);
    } else {
      form.reset({
        name: "",
        distanceKm: 5,
        fee: 5,
        estimatedTime: "20-30 min",
        color: "#3B82F6",
      });
    }
  }, [existingZone, form]);

  const onSubmit = (values: z.infer<typeof deliveryZoneSchema>) => {
    const zone: DeliveryZone = {
      id: existingZone?.id || `zone-${Date.now()}`,
      ...values
    };
    
    onSave(zone);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingZone ? "Editar Zona de Entrega" : "Nova Zona de Entrega"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Zona</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Centro, Zona Sul, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="distanceKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distância máxima (km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de entrega (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimatedTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo estimado</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ex: 20-30 min"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor (para o mapa)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          type="color"
                          className="w-12 h-9 p-1"
                          {...field} 
                        />
                        <Input 
                          type="text"
                          className="flex-1"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {existingZone ? "Salvar Alterações" : "Adicionar Zona"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryZoneModal;
