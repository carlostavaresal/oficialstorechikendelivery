
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, Coins } from "lucide-react";

export type PaymentMethod = "cash" | "pix" | "credit" | "debit";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <h3 className="font-medium mb-3">Forma de Pagamento</h3>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as PaymentMethod)}
        className="grid grid-cols-2 gap-3"
      >
        <div className={`flex items-center space-x-3 space-y-0 rounded-md border p-3 cursor-pointer ${value === "cash" ? "border-primary" : ""}`}>
          <RadioGroupItem value="cash" id="cash" />
          <Banknote className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="cash" className="font-normal cursor-pointer">Dinheiro</Label>
        </div>
        
        <div className={`flex items-center space-x-3 space-y-0 rounded-md border p-3 cursor-pointer ${value === "pix" ? "border-primary" : ""}`}>
          <RadioGroupItem value="pix" id="pix" />
          <Coins className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="pix" className="font-normal cursor-pointer">Pix</Label>
        </div>
        
        <div className={`flex items-center space-x-3 space-y-0 rounded-md border p-3 cursor-pointer ${value === "credit" ? "border-primary" : ""}`}>
          <RadioGroupItem value="credit" id="credit" />
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="credit" className="font-normal cursor-pointer">Cartão de Crédito</Label>
        </div>
        
        <div className={`flex items-center space-x-3 space-y-0 rounded-md border p-3 cursor-pointer ${value === "debit" ? "border-primary" : ""}`}>
          <RadioGroupItem value="debit" id="debit" />
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="debit" className="font-normal cursor-pointer">Cartão de Débito</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
