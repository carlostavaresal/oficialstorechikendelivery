
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ClientLayout from "@/components/layout/ClientLayout";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PaymentMethodSelector, { PaymentMethod } from "@/components/payment/PaymentMethodSelector";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";
import { Product } from "@/components/products/ProductsList";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  paymentMethod: z.enum(["cash", "credit", "debit", "pix"]),
});

type FormValues = z.infer<typeof formSchema>;

const Checkout = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{id: string, quantity: number, notes: string}[]>([]);
  const [itemWithNoteId, setItemWithNoteId] = useState<string | null>(null);
  const [itemNote, setItemNote] = useState<string>("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      paymentMethod: "cash",
    },
  });

  useEffect(() => {
    // Load products
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    // Load cart
    const savedCart = localStorage.getItem('clientCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // If no cart, redirect back to catalog
      navigate('/client');
    }
    
    // Load saved user info if available
    const savedUserInfo = localStorage.getItem('clientUserInfo');
    if (savedUserInfo) {
      const userInfo = JSON.parse(savedUserInfo);
      form.reset(userInfo);
    }
  }, [navigate, form]);

  const getProduct = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = getProduct(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const updateItemNote = (id: string, note: string) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, notes: note } : item
    ));
  };

  const saveNoteForItem = () => {
    if (itemWithNoteId) {
      updateItemNote(itemWithNoteId, itemNote);
      setItemWithNoteId(null);
      setItemNote("");
      
      toast({
        title: "Observação salva",
        description: "Suas instruções para o item foram salvas",
      });
      
      // Update localStorage
      localStorage.setItem('clientCart', JSON.stringify(cart));
    }
  };

  const removeCartItem = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    toast({
      title: "Item removido",
      description: "Item removido do carrinho",
    });
    
    // Update localStorage
    localStorage.setItem('clientCart', JSON.stringify(
      cart.filter(item => item.id !== id)
    ));
  };

  const onSubmit = (data: FormValues) => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao seu carrinho antes de finalizar o pedido",
        variant: "destructive",
      });
      return;
    }
    
    // Save user info for convenience
    localStorage.setItem('clientUserInfo', JSON.stringify(data));
    
    // Create order object
    const order = {
      id: `order-${Date.now()}`,
      customerName: data.name,
      customerPhone: data.phone,
      customerAddress: data.address,
      paymentMethod: data.paymentMethod,
      items: cart.map(item => {
        const product = getProduct(item.id);
        return {
          product: product,
          quantity: item.quantity,
          notes: item.notes,
          subtotal: product ? product.price * item.quantity : 0
        };
      }),
      total: getCartTotal(),
      status: "received",
      createdAt: new Date().toISOString()
    };
    
    // Save order to localStorage
    const savedOrders = localStorage.getItem('orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('clientCart');
    setCart([]);
    
    toast({
      title: "Pedido realizado com sucesso!",
      description: "Seu pedido foi enviado e está sendo processado.",
    });
    
    // Redirect to success page
    navigate('/client/success');
  };

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/client" className="inline-flex items-center text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Produtos
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2" />
                  Seu Carrinho
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">Seu carrinho está vazio</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => {
                      const product = getProduct(item.id);
                      return product ? (
                        <div key={item.id} className="flex justify-between border-b pb-4">
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{item.quantity} x {formatCurrency(product.price)}</span>
                            </div>
                            {item.notes && (
                              <p className="text-sm mt-1 bg-muted p-2 rounded">
                                Obs: {item.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <span className="font-medium">
                              {formatCurrency(product.price * item.quantity)}
                            </span>
                            <div className="flex space-x-1 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setItemWithNoteId(item.id);
                                  setItemNote(item.notes || "");
                                }}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Obs
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => removeCartItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                
                {/* Note editor modal */}
                {itemWithNoteId && (
                  <div className="mt-4 border rounded-md p-4">
                    <h4 className="font-medium mb-2">Adicionar observação</h4>
                    <Textarea
                      value={itemNote}
                      onChange={(e) => setItemNote(e.target.value)}
                      placeholder="Ex: Sem cebola, bem passado..."
                      className="mb-2"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setItemWithNoteId(null);
                          setItemNote("");
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={saveNoteForItem}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(getCartTotal())}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Customer Information Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Seu nome completo" 
                              {...field} 
                              autoComplete="name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(00) 00000-0000" 
                              {...field} 
                              autoComplete="tel"
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço completo</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Rua, número, bairro, complemento..." 
                              {...field} 
                              autoComplete="street-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forma de Pagamento</FormLabel>
                          <FormControl>
                            <div className="mt-1">
                              <PaymentMethodSelector
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Finalizar Pedido
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Checkout;
