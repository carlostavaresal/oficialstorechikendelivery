
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
import { useToast } from "@/hooks/use-toast";

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  expiresAt: Date | null;
  maxUses: number;
  currentUses: number;
  active: boolean;
}

export interface PromotionalCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: PromoCode) => void;
  initialPromo: PromoCode | null;
}

const PromotionalCodeModal: React.FC<PromotionalCodeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPromo,
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState(initialPromo?.code || "");
  const [discount, setDiscount] = useState(initialPromo?.discount.toString() || "");
  const [type, setType] = useState<"percentage" | "fixed">(initialPromo?.type || "percentage");
  const [expiryDate, setExpiryDate] = useState(
    initialPromo?.expiresAt ? 
      initialPromo.expiresAt.toISOString().slice(0, 10) : 
      ""
  );
  const [maxUses, setMaxUses] = useState(initialPromo?.maxUses.toString() || "");
  const [active, setActive] = useState(initialPromo?.active ?? true);

  const handleSave = () => {
    if (!code.trim()) {
      toast({
        title: "Erro",
        description: "O código promocional não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    const parsedDiscount = parseFloat(discount);
    const parsedMaxUses = parseInt(maxUses, 10);

    if (isNaN(parsedDiscount) || parsedDiscount <= 0) {
      toast({
        title: "Erro",
        description: "Desconto deve ser um valor maior que zero",
        variant: "destructive",
      });
      return;
    }

    // Validate percentage is between 1 and 100
    if (type === "percentage" && (parsedDiscount < 1 || parsedDiscount > 100)) {
      toast({
        title: "Erro",
        description: "Desconto percentual deve estar entre 1% e 100%",
        variant: "destructive",
      });
      return;
    }

    const newPromo: PromoCode = {
      id: initialPromo?.id || crypto.randomUUID(),
      code: code.trim().toUpperCase(),
      discount: parsedDiscount,
      type,
      expiresAt: expiryDate ? new Date(expiryDate) : null,
      maxUses: isNaN(parsedMaxUses) ? 0 : parsedMaxUses,
      currentUses: initialPromo?.currentUses || 0,
      active,
    };

    onSave(newPromo);
    onClose();
    
    toast({
      title: initialPromo ? "Código promocional atualizado" : "Código promocional criado",
      description: `${newPromo.code} foi ${initialPromo ? "atualizado" : "criado"} com sucesso`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialPromo ? "Editar Código" : "Novo Código Promocional"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Código
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3"
              placeholder="BEMVINDO10"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">
              Desconto
            </Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="col-span-2"
              placeholder={type === "percentage" ? "10" : "5.00"}
            />
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
              className="p-2 border rounded"
            >
              <option value="percentage">%</option>
              <option value="fixed">R$</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiryDate" className="text-right">
              Validade
            </Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxUses" className="text-right">
              Usos máximos
            </Label>
            <Input
              id="maxUses"
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="col-span-3"
              placeholder="Deixe vazio para ilimitado"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <input
                id="active"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">
                {active ? "Código ativo" : "Código inativo"}
              </span>
            </div>
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

export default PromotionalCodeModal;
