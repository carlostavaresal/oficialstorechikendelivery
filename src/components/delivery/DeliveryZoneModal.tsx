
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DeliveryZone } from "@/pages/delivery/DeliveryAreas";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formatCurrency } from "@/lib/formatters";

const deliveryZoneSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  radius: z.coerce.number().positive("O raio deve ser um número positivo"),
  deliveryFee: z.coerce.number().min(0, "A taxa deve ser um valor positivo ou zero"),
  minOrderValue: z.coerce.number().min(0, "O valor mínimo deve ser positivo ou zero"),
  active: z.boolean().default(true),
});

interface DeliveryZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: DeliveryZone) => void;
  order?: DeliveryZone;
}

const DeliveryZoneModal = ({ isOpen, onClose, onSave, order }: DeliveryZoneModalProps) => {
  const form = useForm<z.infer<typeof deliveryZoneSchema>>({
    resolver: zodResolver(deliveryZoneSchema),
    defaultValues: {
      name: "",
      description: "",
      radius: 5,
      deliveryFee: 0,
      minOrderValue: 0,
      active: true,
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        name: order.name,
        description: order.description || "",
        radius: order.radius,
        deliveryFee: order.deliveryFee,
        minOrderValue: order.minOrderValue,
        active: order.active,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        radius: 5,
        deliveryFee: 0,
        minOrderValue: 0,
        active: true,
      });
    }
  }, [order, form]);

  const onSubmit = (values: z.infer<typeof deliveryZoneSchema>) => {
    onSave({
      id: order?.id || "",
      ...values
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {order ? "Editar Zona de Entrega" : "Nova Zona de Entrega"}
          </DialogTitle>
          <DialogDescription>
            Defina os detalhes da área de entrega e suas condições
          </DialogDescription>
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
                    <Input placeholder="Ex: Centro, Zona Norte" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição opcional da área de entrega"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raio (km)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormDescription>Distância em quilômetros</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Entrega</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {formatCurrency(form.watch("deliveryFee") || 0)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="minOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pedido Mínimo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {formatCurrency(form.watch("minOrderValue") || 0)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Ativa</FormLabel>
                    <FormDescription>
                      Determina se esta zona está disponível para entrega
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryZoneModal;
