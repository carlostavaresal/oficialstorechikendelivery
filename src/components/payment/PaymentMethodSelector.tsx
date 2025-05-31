
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

export type PaymentMethod = "pix" | "credit" | "cash";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const paymentMethods = [
    {
      id: "pix" as PaymentMethod,
      label: "PIX",
      icon: Smartphone,
      description: "Transferência instantânea"
    },
    {
      id: "credit" as PaymentMethod,
      label: "Cartão de Crédito",
      icon: CreditCard,
      description: "Débito ou crédito"
    },
    {
      id: "cash" as PaymentMethod,
      label: "Dinheiro",
      icon: Banknote,
      description: "Pagamento na entrega"
    }
  ];

  return (
    <RadioGroup 
      value={value} 
      onValueChange={onChange}
      disabled={disabled}
      className="grid grid-cols-1 gap-4"
    >
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        return (
          <div key={method.id} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={method.id} 
              id={method.id} 
              disabled={disabled}
            />
            <Label 
              htmlFor={method.id} 
              className={`flex items-center space-x-3 cursor-pointer flex-1 p-4 border rounded-lg transition-colors ${
                value === method.id 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Icon className="h-5 w-5" />
              <div>
                <div className="font-medium">{method.label}</div>
                <div className="text-sm text-muted-foreground">
                  {method.description}
                </div>
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
