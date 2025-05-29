
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";

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
  const [items, setItems] = useState<MenuItem[]>(() => {
    const savedItems = localStorage.getItem("menuItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("menuCategories");
    return savedCategories 
      ? JSON.parse(savedCategories) 
      : [{ id: "1", name: "Geral" }];
  });

  // Save to localStorage whenever items change
  React.useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(items));
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

  const itemsByCategory = categories.map((category) => {
    return {
      category,
      items: items.filter((item) => item.category === category.id),
    };
  });

  const availableItems = items.filter(item => item.isAvailable);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cardápio Online</h1>
            <p className="text-muted-foreground">
              Gerencie os produtos que aparecem para os clientes no seu cardápio online
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{availableItems.length}</p>
            <p className="text-sm text-muted-foreground">Itens disponíveis</p>
          </div>
        </div>

        {/* Menu Display */}
        <Card>
          <CardHeader>
            <CardTitle>Cardápio para Clientes</CardTitle>
            <CardDescription>
              Todos os produtos cadastrados. Use os controles para gerenciar disponibilidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itemsByCategory.length === 0 || items.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <p className="text-xl mb-2">Seu cardápio está vazio</p>
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
                      <div className="grid gap-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex justify-between items-center p-4 border rounded-lg transition-all ${
                              !item.isAvailable ? "opacity-50 bg-muted" : "bg-background"
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                  {item.name}
                                  {!item.isAvailable && (
                                    <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                                      Indisponível
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.description}
                                </div>
                                <div className="font-medium text-primary mt-1">
                                  {formatCurrency(item.price)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <label htmlFor={`toggle-${item.id}`} className="text-sm font-medium">
                                  {item.isAvailable ? 'Disponível' : 'Indisponível'}
                                </label>
                                <Switch
                                  id={`toggle-${item.id}`}
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
                          </div>
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
