
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgePercent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PromoCode } from "@/components/promotions/PromotionalCodeModal";

interface PromoCodeInputProps {
  onApply: (discount: number) => void;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApply }) => {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [appliedCode, setAppliedCode] = useState<PromoCode | null>(null);

  const verifyPromoCode = (code: string) => {
    // Carrega códigos do localStorage
    const savedPromoCodes = localStorage.getItem("promoCodes");
    if (!savedPromoCodes) return null;
    
    try {
      const promos = JSON.parse(savedPromoCodes).map((promo: any) => ({
        ...promo,
        expiresAt: promo.expiresAt ? new Date(promo.expiresAt) : null,
      }));
      
      // Procura o código
      const foundCode = promos.find(
        (promo: PromoCode) => promo.code.toUpperCase() === code.trim().toUpperCase()
      );

      if (!foundCode) return null;

      // Verifica se o código está ativo
      if (!foundCode.active) return { valid: false, message: "Este código promocional está inativo." };
      
      // Verifica se expirou
      if (foundCode.expiresAt && new Date(foundCode.expiresAt) < new Date()) {
        return { valid: false, message: "Este código promocional expirou." };
      }
      
      // Verifica usos máximos
      if (foundCode.maxUses > 0 && foundCode.currentUses >= foundCode.maxUses) {
        return { valid: false, message: "Este código promocional já atingiu seu limite de uso." };
      }
      
      // Atualiza contagem de uso
      foundCode.currentUses += 1;
      
      // Salva códigos atualizados no localStorage
      localStorage.setItem("promoCodes", JSON.stringify(
        promos.map((p: PromoCode) => p.id === foundCode.id ? foundCode : p)
      ));
      
      return { valid: true, promo: foundCode };
    } catch (error) {
      console.error("Erro ao verificar código promocional:", error);
      return { valid: false, message: "Ocorreu um erro ao verificar o código." };
    }
  };

  const applyPromoCode = () => {
    if (!code.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite um código promocional",
        variant: "destructive",
      });
      return;
    }

    if (isApplied) {
      toast({
        title: "Código já aplicado",
        description: "Um código promocional já foi aplicado a este pedido",
      });
      return;
    }

    const result = verifyPromoCode(code);
    
    if (!result) {
      toast({
        title: "Código inválido",
        description: "Este código promocional não existe",
        variant: "destructive",
      });
      return;
    }
    
    if (!result.valid) {
      toast({
        title: "Código inválido",
        description: result.message,
        variant: "destructive",
      });
      return;
    }
    
    // Código válido
    const promo = result.promo;
    setIsApplied(true);
    setAppliedCode(promo);
    
    // Calcula o desconto baseado no tipo
    let discountValue = 0;
    if (promo.type === "percentage") {
      // Percentual do total (será calculado no componente pai)
      discountValue = promo.discount / 100;
    } else {
      // Valor fixo
      discountValue = promo.discount;
    }
    
    onApply(discountValue);
    
    toast({
      title: "Código aplicado",
      description: promo.type === "percentage" ? 
        `Desconto de ${promo.discount}% aplicado` : 
        `Desconto de R$ ${promo.discount.toFixed(2)} aplicado`,
    });
  };

  const removePromoCode = () => {
    setIsApplied(false);
    setAppliedCode(null);
    setCode("");
    onApply(0);
    
    toast({
      title: "Código removido",
      description: "O código promocional foi removido",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <BadgePercent className="mr-2 h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Código Promocional</h3>
      </div>
      
      {isApplied ? (
        <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
          <div>
            <span className="font-medium">{appliedCode?.code}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {appliedCode?.type === "percentage" ? 
                `${appliedCode.discount}% de desconto` : 
                `R$ ${appliedCode.discount.toFixed(2)} de desconto`}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={removePromoCode}>
            Remover
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Input
            placeholder="Digite seu código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={applyPromoCode}>Aplicar</Button>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;
