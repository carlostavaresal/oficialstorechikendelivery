import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeliveryZone } from "@/pages/delivery/DeliveryAreas";

export interface DeliveryZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: DeliveryZone) => void;
  initialZone: DeliveryZone | null;
}

const DeliveryZoneModal: React.FC<DeliveryZoneModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialZone,
}) => {
  const [name, setName] = useState(initialZone?.name || "");
  const [radius, setRadius] = useState(initialZone?.radius?.toString() || "");
  const [fee, setFee] = useState(initialZone?.fee?.toString() || "");
  const [estimatedTime, setEstimatedTime] = useState(
    initialZone?.estimatedTime?.toString() || ""
  );

  const handleSave = () => {
    const parsedRadius = parseFloat(radius);
    const parsedFee = parseFloat(fee);
    const parsedEstimatedTime = parseInt(estimatedTime, 10);

    if (
      !name.trim() ||
      isNaN(parsedRadius) ||
      isNaN(parsedFee) ||
      isNaN(parsedEstimatedTime)
    ) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const newZone: DeliveryZone = {
      id: initialZone?.id || crypto.randomUUID(),
      name: name.trim(),
      radius: parsedRadius,
      fee: parsedFee,
      estimatedTime: parsedEstimatedTime,
    };

    onSave(newZone);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialZone ? "Editar Zona" : "Nova Zona"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="radius" className="text-right">
              Raio (km)
            </Label>
            <Input
              id="radius"
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fee" className="text-right">
              Taxa (R$)
            </Label>
            <Input
              id="fee"
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimatedTime" className="text-right">
              Tempo Estimado (min)
            </Label>
            <Input
              id="estimatedTime"
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryZoneModal;
