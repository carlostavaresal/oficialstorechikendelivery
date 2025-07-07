
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
import { useOrders } from "@/hooks/useOrders";
import { useCompanySettings } from "@/hooks/useCompanySettings";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { settings } = useCompanySettings();
  const [cart, setCart] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = settings?.delivery_fee || 0;
    return subtotal + deliveryFee;
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    const numericOnly = phone.replace(/\D/g, "");
    if (numericOnly.length === 11 || numericOnly.length === 10) {
      return `55${numericOnly}`;
    }
    return numericOnly;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !address) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const minimumOrder = settings?.minimum_order || 0;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotal < minimumOrder) {
      toast({
        title: "Pedido mínimo não atingido",
        description: `O valor mínimo para pedidos é R$ ${minimumOrder.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const orderData = {
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: calculateTotal(),
        payment_method: paymentMethod,
        notes: notes || undefined,
        status: 'pending' as const
      };

      const newOrder = await createOrder(orderData);
      
      // Clear cart
      localStorage.removeItem("cart");
      
      // Notification sound
      playNotificationSound(NOTIFICATION_SOUNDS.NEW_ORDER);
      
      // Send to WhatsApp if number is configured
      if (settings?.whatsapp_number && newOrder) {
        const orderItems = cart.map(item => 
          `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        const deliveryFee = settings.delivery_fee || 0;
        const total = calculateTotal();
        
        const paymentDisplayName = {
          pix: 'PIX',
          money: 'Dinheiro',
          card: 'Cartão'
        }[paymentMethod] || paymentMethod;
        
        const message = encodeURIComponent(
          `🛒 *NOVO PEDIDO* - ${newOrder.order_number}\n\n` +
          `👤 *Cliente:* ${name}\n` +
          `📱 *Telefone:* ${phone}\n` +
          `📍 *Endereço:* ${address}\n\n` +
          `📋 *Itens:*\n${orderItems}\n\n` +
          `💳 *Pagamento:* ${paymentDisplayName}\n` +
          (deliveryFee > 0 ? `🚚 *Taxa de Entrega:* R$ ${deliveryFee.toFixed(2)}\n` : '') +
          `💰 *Total:* R$ ${total.toFixed(2)}\n\n` +
          (notes ? `📝 *Observações:* ${notes}\n\n` : '') +
          `✅ *Confirme este pedido para iniciar o preparo!*`
        );
        
        window.open(`https://wa.me/${formatPhoneForWhatsApp(settings.whatsapp_number)}?text=${message}`, "_blank");
      }
      
      // Success toast
      toast({
        title: "Pedido realizado!",
        description: "Seu pedido foi enviado com sucesso.",
      });
      
      // Redirect to success page
      navigate("/client/success");
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erro ao criar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = settings?.delivery_fee || 0;
  const total = calculateTotal();

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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <PaymentMethodSelector
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processando..." : "Finalizar Pedido"}
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
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa de Entrega</span>
                      <span>R$ {deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-muted-foreground">
                    <p>* Campos obrigatórios</p>
                    {settings?.minimum_order && settings.minimum_order > 0 && (
                      <p className="mt-1">Pedido mínimo: R$ {settings.minimum_order.toFixed(2)}</p>
                    )}
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
