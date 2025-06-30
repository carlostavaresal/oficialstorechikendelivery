
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import ClientLayout from "@/components/layout/ClientLayout";

interface MenuItem {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
}

interface CartItem extends MenuItem {
  quantidade: number;
}

const CardapioPage = () => {
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { settings } = useCompanySettings();
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);

  // Menu items de exemplo
  const menuItems: MenuItem[] = [
    {
      id: "1",
      nome: "Hambúrguer Clássico",
      preco: 25.90,
      descricao: "Pão, carne, queijo, alface, tomate",
      categoria: "Hambúrgueres"
    },
    {
      id: "2",
      nome: "Pizza Margherita",
      preco: 35.00,
      descricao: "Molho de tomate, mussarela, manjericão",
      categoria: "Pizzas"
    },
    {
      id: "3",
      nome: "Coca-Cola 350ml",
      preco: 5.50,
      descricao: "Refrigerante gelado",
      categoria: "Bebidas"
    }
  ];

  const adicionarAoCarrinho = (item: MenuItem) => {
    setCarrinho(prevCarrinho => {
      const itemExistente = prevCarrinho.find(cartItem => cartItem.id === item.id);
      
      if (itemExistente) {
        return prevCarrinho.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantidade: cartItem.quantidade + 1 }
            : cartItem
        );
      } else {
        return [...prevCarrinho, { ...item, quantidade: 1 }];
      }
    });

    toast({
      title: "Item adicionado",
      description: `${item.nome} foi adicionado ao carrinho`,
    });
  };

  const removerDoCarrinho = (itemId: string) => {
    setCarrinho(prevCarrinho => {
      const item = prevCarrinho.find(cartItem => cartItem.id === itemId);
      
      if (item && item.quantidade > 1) {
        return prevCarrinho.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantidade: cartItem.quantidade - 1 }
            : cartItem
        );
      } else {
        return prevCarrinho.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  const removerItemCompleto = (itemId: string) => {
    setCarrinho(prevCarrinho => prevCarrinho.filter(cartItem => cartItem.id !== itemId));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    const numericOnly = phone.replace(/\D/g, "");
    if (numericOnly.length === 11 || numericOnly.length === 10) {
      return `55${numericOnly}`;
    }
    return numericOnly;
  };

  const handleFazerPedidoWhatsApp = () => {
    if (carrinho.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de fazer o pedido",
        variant: "destructive",
      });
      return;
    }

    if (!settings?.whatsapp_number) {
      toast({
        title: "Erro",
        description: "Número do WhatsApp não configurado",
        variant: "destructive",
      });
      return;
    }

    const total = calcularTotal();
    const deliveryFee = settings.delivery_fee || 0;
    const totalComEntrega = total + deliveryFee;

    // Verificar pedido mínimo
    if (settings.minimum_order && total < settings.minimum_order) {
      toast({
        title: "Pedido mínimo não atingido",
        description: `O valor mínimo para pedidos é R$ ${settings.minimum_order.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    // Montar mensagem do WhatsApp
    const itensTexto = carrinho.map(item => 
      `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}`
    ).join('\n');

    const mensagem = encodeURIComponent(
      `🛒 *NOVO PEDIDO*\n\n` +
      `📋 *Itens:*\n${itensTexto}\n\n` +
      `💰 *Subtotal:* R$ ${total.toFixed(2)}\n` +
      (deliveryFee > 0 ? `🚚 *Taxa de Entrega:* R$ ${deliveryFee.toFixed(2)}\n` : '') +
      `💵 *Total:* R$ ${totalComEntrega.toFixed(2)}\n\n` +
      `Gostaria de finalizar este pedido!`
    );

    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(settings.whatsapp_number)}?text=${mensagem}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Redirecionando para WhatsApp",
      description: "Complete seu pedido pelo WhatsApp",
    });
  };

  const categorias = [...new Set(menuItems.map(item => item.categoria))];

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Cardápio</h1>
            
            {categorias.map(categoria => (
              <div key={categoria} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{categoria}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems
                    .filter(item => item.categoria === categoria)
                    .map(item => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{item.nome}</CardTitle>
                            <Badge variant="secondary">
                              R$ {item.preco.toFixed(2)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{item.descricao}</p>
                          <Button 
                            onClick={() => adicionarAoCarrinho(item)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar ao Carrinho
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Carrinho */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrinho ({carrinho.reduce((total, item) => total + item.quantidade, 0)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {carrinho.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Seu carrinho está vazio
                  </p>
                ) : (
                  <div className="space-y-4">
                    {carrinho.map(item => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            R$ {item.preco.toFixed(2)} cada
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removerDoCarrinho(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantidade}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => adicionarAoCarrinho(item)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removerItemCompleto(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>R$ {calcularTotal().toFixed(2)}</span>
                      </div>
                      {settings?.delivery_fee && settings.delivery_fee > 0 && (
                        <div className="flex justify-between mb-2">
                          <span>Taxa de Entrega:</span>
                          <span>R$ {settings.delivery_fee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>R$ {(calcularTotal() + (settings?.delivery_fee || 0)).toFixed(2)}</span>
                      </div>
                    </div>

                    {settings?.minimum_order && calcularTotal() < settings.minimum_order && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                        <p className="text-yellow-800">
                          Pedido mínimo: R$ {settings.minimum_order.toFixed(2)}
                        </p>
                        <p className="text-yellow-600">
                          Faltam R$ {(settings.minimum_order - calcularTotal()).toFixed(2)}
                        </p>
                      </div>
                    )}

                    <Button 
                      onClick={handleFazerPedidoWhatsApp}
                      className="w-full"
                      disabled={carrinho.length === 0 || (settings?.minimum_order && calcularTotal() < settings.minimum_order)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Fazer Pedido via WhatsApp
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default CardapioPage;
