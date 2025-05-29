
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Cardápio Online</h1>

        {/* Menu Display */}
        <Card>
          <CardHeader>
            <CardTitle>Visualização do Cardápio</CardTitle>
            <CardDescription>
              Como seu cardápio aparece para os clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itemsByCategory.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <p>Seu cardápio está vazio</p>
                <p className="text-sm">
                  Adicione itens para começar.
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
                            className={`flex justify-between items-center p-3 border rounded-md ${
                              !item.isAvailable ? "opacity-50 bg-muted" : ""
                            }`}
                          >
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
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="font-medium">
                                R$ {item.price.toFixed(2)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={item.isAvailable}
                                  onCheckedChange={() => handleToggleItemAvailability(item.id)}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  Remover
                                </Button>
                              </div>
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
