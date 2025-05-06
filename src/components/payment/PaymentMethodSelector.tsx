
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
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
        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3 cursor-pointer data-[state=checked]:border-primary">
          <FormControl>
            <RadioGroupItem value="cash" className="sr-only" />
          </FormControl>
          <Banknote className="h-5 w-5 text-muted-foreground" />
          <FormLabel className="font-normal cursor-pointer">Dinheiro</FormLabel>
        </FormItem>
        
        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3 cursor-pointer data-[state=checked]:border-primary">
          <FormControl>
            <RadioGroupItem value="pix" className="sr-only" />
          </FormControl>
          <Coins className="h-5 w-5 text-muted-foreground" />
          <FormLabel className="font-normal cursor-pointer">Pix</FormLabel>
        </FormItem>
        
        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3 cursor-pointer data-[state=checked]:border-primary">
          <FormControl>
            <RadioGroupItem value="credit" className="sr-only" />
          </FormControl>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <FormLabel className="font-normal cursor-pointer">Cartão de Crédito</FormLabel>
        </FormItem>
        
        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3 cursor-pointer data-[state=checked]:border-primary">
          <FormControl>
            <RadioGroupItem value="debit" className="sr-only" />
          </FormControl>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <FormLabel className="font-normal cursor-pointer">Cartão de Débito</FormLabel>
        </FormItem>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
