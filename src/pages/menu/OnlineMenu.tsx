
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";
import { QrCode, Link as LinkIcon, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
}

const OnlineMenu: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { products, loading } = useProducts();
  const [items, setItems] = useState<MenuItem[]>([]);

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("menuCategories");
    return savedCategories 
      ? JSON.parse(savedCategories) 
      : [{ id: "1", name: "Geral" }];
  });

  // Processar produtos do Supabase ou localStorage
  useEffect(() => {
    const processProducts = () => {
      console.log('Processando produtos:', products);
      
      if (products.length > 0) {
        // Usar produtos do Supabase
        const formattedItems = products.map((product) => ({
          id: product.id,
          name: product.name || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          category: product.category || "Geral",
          isAvailable: product.is_available !== false,
          imageUrl: product.image_url || ''
        }));
        setItems(formattedItems);
        console.log('Items do Supabase:', formattedItems);
      } else if (!loading) {
        // Fallback para localStorage se não houver produtos no Supabase
        const savedProducts = localStorage.getItem("products");
        console.log('Produtos do localStorage:', savedProducts);
        
        if (savedProducts) {
          const products = JSON.parse(savedProducts);
          const updatedItems = products.map((product: any) => {
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
              name: product.name || '',
              description: product.description || '',
              price: Number(product.price) || 0,
              category: product.category || "Geral",
              isAvailable: true,
              imageUrl: imageUrl
            };
          });
          setItems(updatedItems);
          console.log('Items do localStorage processados:', updatedItems);
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

  // Save to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("menuItems", JSON.stringify(items));
    }
  }, [items]);

  const handleToggleItemAvailability = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    
    const item = items.find(i => i.id === id);
    if (item) {
      toast({
        title: item.isAvailable ? "Item desabilitado" : "Item habilitado",
        description: `${item.name} foi ${item.isAvailable ? 'removido' : 'adicionado'} ao cardápio online.`,
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(items.filter(item => item.id !== id));
    
    if (item) {
      toast({
        title: "Item removido",
        description: `O item "${item.name}" foi removido do cardápio.`,
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = () => {
    const menuUrl = `${window.location.origin}/client`;
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Link copiado",
      description: "Link do cardápio copiado para a área de transferência",
    });
  };

  const handleDownloadQR = () => {
    const menuUrl = `${window.location.origin}/client`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'cardapio-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code baixado",
      description: "QR Code do cardápio foi baixado com sucesso",
    });
  };

  const itemsByCategory = categories.map((category) => {
    return {
      category,
      items: items.filter((item) => item.category === category.id || item.category === category.name),
    };
  });

  const availableItems = items.filter(item => item.isAvailable);
  const menuUrl = `${window.location.origin}/client`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;

  console.log('Total de items:', items.length);
  console.log('Items disponíveis:', availableItems.length);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cardápio Online</h1>
            <p className="text-muted-foreground">
              Visualize todos os produtos adicionados e compartilhe o cardápio com seus clientes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{availableItems.length}</p>
              <p className="text-sm text-muted-foreground">Itens disponíveis</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Compartilhar Cardápio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Compartilhar Cardápio Online</DialogTitle>
                  <DialogDescription>
                    Compartilhe o cardápio online para que seus clientes possam fazer pedidos.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="qrcode" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                    <TabsTrigger value="link">Link</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="qrcode" className="py-4">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="border border-border p-3 rounded-md bg-white">
                        <img src={qrCodeUrl} alt="QR Code do cardápio" className="w-52 h-52" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Escaneie este QR code para acessar o cardápio online
                      </p>
                      <Button onClick={handleDownloadQR} variant="outline" className="w-full">
                        Baixar QR Code
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="link" className="py-4">
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground">
                        Copie este link e compartilhe com seus clientes
                      </p>
                      <div className="flex gap-2">
                        <Input value={menuUrl} readOnly className="flex-1" />
                        <Button onClick={handleCopyLink} variant="secondary" className="flex-shrink-0">
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground text-center">
                    Os clientes podem fazer pedidos diretamente pelo cardápio online
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Produtos do Cardápio</CardTitle>
            <CardDescription>
              Todos os produtos adicionados e suas configurações. Gerencie a disponibilidade para os clientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center p-12 text-muted-foreground">
                <p className="text-xl mb-2">Carregando produtos...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <p className="text-xl mb-2">Nenhum produto cadastrado</p>
                <p className="text-sm">
                  Vá para a página "Produtos" para adicionar itens ao seu cardápio.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {itemsByCategory.map(({ category, items }) => (
                  <div key={category.id}>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                      {category.name}
                    </h3>
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum item nesta categoria
                      </p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                          <Card
                            key={item.id}
                            className={`overflow-hidden transition-all ${
                              !item.isAvailable ? "opacity-50 bg-muted" : "bg-background"
                            }`}
                          >
                            <div className="relative pt-[60%]">
                              <img
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.name}
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={(e) => {
                                  console.log('Erro ao carregar imagem:', item.imageUrl);
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                              {!item.isAvailable && (
                                <div className="absolute top-2 right-2">
                                  <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                                    Indisponível
                                  </span>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-medium text-lg mb-2">{item.name}</h4>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {item.description}
                              </p>
                              <p className="text-xl font-bold text-primary mb-4">
                                {formatCurrency(item.price)}
                              </p>
                              
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {item.isAvailable ? 'Disponível' : 'Indisponível'}
                                  </span>
                                  <Switch
                                    checked={item.isAvailable}
                                    onCheckedChange={() => handleToggleItemAvailability(item.id)}
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  Excluir
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OnlineMenu;
