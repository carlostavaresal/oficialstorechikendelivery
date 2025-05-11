
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Save } from "lucide-react";

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

  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: categories[0]?.id || "",
    isAvailable: true,
  });

  const [newCategory, setNewCategory] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Save to localStorage whenever items or categories change
  React.useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(items));
  }, [items]);

  React.useEffect(() => {
    localStorage.setItem("menuCategories", JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria não pode ser vazio.",
        variant: "destructive",
      });
      return;
    }

    const newCategoryObj: Category = {
      id: crypto.randomUUID(),
      name: newCategory.trim(),
    };

    setCategories([...categories, newCategoryObj]);
    setNewCategory("");
    
    toast({
      title: "Categoria adicionada",
      description: `A categoria "${newCategoryObj.name}" foi adicionada com sucesso.`,
    });
  };

  const handleAddItem = () => {
    if (!newItem.name.trim() || newItem.price <= 0 || !newItem.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const itemToAdd: MenuItem = {
      ...newItem,
      id: crypto.randomUUID(),
    };

    setItems([...items, itemToAdd]);
    setNewItem({
      name: "",
      description: "",
      price: 0,
      category: categories[0]?.id || "",
      isAvailable: true,
    });

    toast({
      title: "Item adicionado",
      description: `O item "${itemToAdd.name}" foi adicionado com sucesso.`,
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSaveEditedItem = () => {
    if (!editingItem) return;

    setItems(
      items.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
    
    toast({
      title: "Item atualizado",
      description: `O item "${editingItem.name}" foi atualizado com sucesso.`,
    });
  };

  const handleToggleItemAvailability = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
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

        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">Visualizar Cardápio</TabsTrigger>
            <TabsTrigger value="edit">Gerenciar Itens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cardápio Digital</CardTitle>
                <CardDescription>
                  Visualize como seu cardápio aparece para os clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {itemsByCategory.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    <p>Seu cardápio está vazio</p>
                    <p className="text-sm">
                      Adicione categorias e itens para começar.
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
                            {items
                              .filter(item => item.isAvailable)
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center p-3 border rounded-md"
                                >
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {item.description}
                                    </div>
                                  </div>
                                  <div className="font-medium">
                                    R$ {item.price.toFixed(2)}
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
          </TabsContent>

          <TabsContent value="edit" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Categorias</CardTitle>
                <CardDescription>Adicione ou edite categorias do seu cardápio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nome da nova categoria"
                  />
                  <Button onClick={handleAddCategory} className="shrink-0">
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="p-2 border rounded-md flex justify-between items-center"
                    >
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adicionar Item ao Cardápio</CardTitle>
                <CardDescription>Preencha os detalhes do novo item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Item</Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                        placeholder="Ex: X-Burger"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="Ex: 15.90"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      placeholder="Ex: Hambúrguer com queijo, alface e tomate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <select
                      id="category"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="available"
                      checked={newItem.isAvailable}
                      onCheckedChange={(checked) =>
                        setNewItem({ ...newItem, isAvailable: checked })
                      }
                    />
                    <Label htmlFor="available">Disponível para venda</Label>
                  </div>
                  <Button onClick={handleAddItem} className="w-full">
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Itens</CardTitle>
                <CardDescription>Edite ou remova itens do cardápio</CardDescription>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    <p>Nenhum item no cardápio</p>
                    <p className="text-sm">Adicione itens para começar.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded-md"
                      >
                        {editingItem?.id === item.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <Input
                                value={editingItem.name}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    name: e.target.value,
                                  })
                                }
                              />
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingItem.price}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <Input
                              value={editingItem.description}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  description: e.target.value,
                                })
                              }
                            />
                            <select
                              value={editingItem.category}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  category: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded-md"
                            >
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingItem(null)}
                              >
                                Cancelar
                              </Button>
                              <Button onClick={handleSaveEditedItem}>
                                <Save className="h-4 w-4 mr-1" /> Salvar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                              <div className="text-sm">
                                R$ {item.price.toFixed(2)} |{" "}
                                {categories.find((c) => c.id === item.category)?.name}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={item.isAvailable}
                                  onCheckedChange={() =>
                                    handleToggleItemAvailability(item.id)
                                  }
                                />
                                <span className="text-sm">
                                  {item.isAvailable ? "Disponível" : "Indisponível"}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OnlineMenu;
