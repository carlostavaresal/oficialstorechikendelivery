
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useProducts } from "@/hooks/useProducts";
import ClientLayout from "@/components/layout/ClientLayout";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
  imagem?: string;
  quantidade: number;
}

const CardapioPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { settings } = useCompanySettings();
  const { products, loading } = useProducts();
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // Processar produtos do Supabase ou localStorage
  useEffect(() => {
    const processProducts = () => {
      console.log('CardapioPage - Produtos do Supabase:', products);
      
      if (products.length > 0) {
        // Usar produtos do Supabase
        const items = products.map(product => ({
          id: product.id,
          nome: product.name,
          descricao: product.description || '',
          preco: Number(product.price),
          categoria: product.category || 'Geral',
          imagem: product.image_url || '',
          disponivel: product.is_available !== false
        })).filter(item => item.disponivel);
        
        setMenuItems(items);
        console.log('CardapioPage - Items do Supabase processados:', items);
      } else if (!loading) {
        // Fallback para localStorage
        const savedProducts = localStorage.getItem("products");
        console.log('CardapioPage - Produtos do localStorage:', savedProducts);
        
        if (savedProducts) {
          const products = JSON.parse(savedProducts);
          const items = products.map((product: any) => {
            let imageUrl = '';
            
            if (product.image) {
              if (typeof product.image === 'string') {
                imageUrl = product.image;
              } else if (typeof product.image === 'object') {
                if (product.image.value) {
                  imageUrl = product.image.value;
                } else if (product.image._type === 'String' && product.image.value) {
                  imageUrl = product.image.value;
                }
              }
            }
            
            return {
              id: product.id,
              nome: product.name || '',
              descricao: product.description || '',
              preco: Number(product.price) || 0,
              categoria: product.category || 'Geral',
              imagem: imageUrl,
              disponivel: true
            };
          }).filter((item: any) => item.disponivel);
          
          setMenuItems(items);
          console.log('CardapioPage - Items do localStorage processados:', items);
        }
      }
    };

    processProducts();

    // Listener para atualizar quando produtos localStorage mudarem
    const handleProductsUpdate = () => {
      if (products.length === 0) {
        processProducts();
      }
    };

    window.addEventListener("productsUpdated", handleProductsUpdate);
    return () => window.removeEventListener("productsUpdated", handleProductsUpdate);
  }, [products, loading]);

  const adicionarAoCarrinho = (item: any) => {
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

  const handleFinalizarPedido = () => {
    if (carrinho.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar o pedido",
        variant: "destructive",
      });
      return;
    }

    const total = calcularTotal();
    
    // Verificar pedido mínimo
    if (settings?.minimum_order && total < settings.minimum_order) {
      toast({
        title: "Pedido mínimo não atingido",
        description: `O valor mínimo para pedidos é R$ ${settings.minimum_order.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    // Salvar carrinho no localStorage e redirecionar para checkout
    const cartForCheckout = carrinho.map(item => ({
      id: item.id,
      name: item.nome,
      price: item.preco,
      quantity: item.quantidade
    }));
    
    localStorage.setItem('cart', JSON.stringify(cartForCheckout));
    navigate('/client/checkout');
  };

  const categorias = [...new Set(menuItems.map(item => item.categoria))];

  console.log('CardapioPage - Menu items final:', menuItems);
  console.log('CardapioPage - Categorias:', categorias);

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Cardápio Online</h1>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando cardápio...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-2">Cardápio em atualização</p>
                <p className="text-muted-foreground">
                  Não há produtos disponíveis no momento. Tente novamente em instantes.
                </p>
              </div>
            ) : (
              categorias.map(categoria => (
                <div key={categoria} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{categoria}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter(item => item.categoria === categoria)
                      .map(item => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                          {item.imagem && (
                            <div className="relative pt-[60%]">
                              <img
                                src={item.imagem}
                                alt={item.nome}
                                className="absolute inset-0 h-full w-full object-cover rounded-t-lg"
                                onError={(e) => {
                                  console.log('Erro ao carregar imagem no cardápio:', item.imagem);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
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
              ))
            )}
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
                      onClick={handleFinalizarPedido}
                      className="w-full"
                      disabled={carrinho.length === 0 || (settings?.minimum_order && calcularTotal() < settings.minimum_order)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Finalizar Pedido
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
