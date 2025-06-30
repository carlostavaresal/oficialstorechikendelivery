
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PaymentMethodSelector, { PaymentMethod } from "./PaymentMethodSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodDisplayProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  onSave?: () => void;
  showSaveButton?: boolean;
}

const PaymentMethodDisplay: React.FC<PaymentMethodDisplayProps> = ({
  selectedMethod,
  onMethodChange,
  onSave,
  showSaveButton = true,
}) => {
  const { toast } = useToast();
  
  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    switch (method) {
      case "cash": return "Dinheiro";
      case "pix": return "Pix";
      case "credit": return "Cartão de Crédito";
      default: return "Desconhecido";
    }
  };
  
  const handleSavePaymentMethod = () => {
    if (onSave) {
      onSave();
    } else {
      toast({
        title: "Forma de pagamento salva",
        description: `Forma de pagamento definida como ${getPaymentMethodLabel(selectedMethod)}`,
      });
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-sm">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg font-bold text-primary">
          Formas de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <PaymentMethodSelector
          value={selectedMethod}
          onChange={onMethodChange}
        />
        
        {showSaveButton && (
          <div className="flex justify-end mt-2">
            <Button 
              onClick={handleSavePaymentMethod}
              variant="default"
              size="sm"
            >
              Salvar Forma de Pagamento
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodDisplay;
