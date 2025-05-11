
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ClientLayout from "@/components/layout/ClientLayout";
import { PaymentMethod } from "@/components/payment/PaymentMethodSelector";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import { playNotificationSound, NOTIFICATION_SOUNDS } from "@/lib/soundUtils";
import PromoCodeInput from "@/components/client/PromoCodeInput";

// Adicionando o componente PromoCodeInput à página de checkout do cliente

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // Redirect if cart is empty
      navigate("/client");
    }
  }, [navigate]);

  const calculateTotal = (): number => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = (): number => {
    const subtotal = calculateTotal();
    if (discountType === "percentage") {
      return subtotal * discount;
    }
    return discount; // fixed amount
  };

  const calculateFinalTotal = (): number => {
    return Math.max(0, calculateTotal() - calculateDiscount());
  };

  const handleApplyPromoCode = (discountValue: number) => {
    // Determinar o tipo de desconto baseado no valor
    if (discountValue >= 1) {
      // Se for maior ou igual a 1, consideramos como um valor fixo
      setDiscountType("fixed");
      setDiscount(discountValue);
    } else {
      // Se for menor que 1, consideramos como uma porcentagem (ex: 0.15 para 15%)
      setDiscountType("percentage");
      setDiscount(discountValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !address) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Save order
    const order = {
      id: `#ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customer: name,
      phone,
      address,
      items: cart,
      notes,
      total: calculateFinalTotal(),
      subtotal: calculateTotal(),
      discount: calculateDiscount(),
      paymentMethod,
      status: "pending",
      date: new Date(),
    };

    // Save order to localStorage
    const savedOrders = localStorage.getItem("orders") || "[]";
    const orders = JSON.parse(savedOrders);
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem("cart");
    
    // Notification sound
    playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER);
    
    // Success toast
    toast({
      title: "Pedido realizado!",
      description: "Seu pedido foi enviado com sucesso.",
    });
    
    // Redirect to success page
    navigate("/client/success");
  };

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Dados para Entrega</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(99) 99999-9999"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço Completo *
                  </label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, complemento, bairro, cidade"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Sem cebola, troco para R$ 50,00, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <PaymentMethodSelector
                    selected={paymentMethod}
                    onSelect={setPaymentMethod}
                  />
                </div>
                
                <div>
                  <PromoCodeInput onApply={handleApplyPromoCode} />
                </div>
                
                <Button type="submit" className="w-full">
                  Finalizar Pedido
                </Button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
              
              {cart.length === 0 ? (
                <p>Seu carrinho está vazio</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>- R$ {calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {calculateFinalTotal().toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-muted-foreground">
                    <p>* Campos obrigatórios</p>
                    <p className="mt-2">Após finalizar o pedido, entraremos em contato para confirmar os detalhes.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Checkout;
