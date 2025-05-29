
import React, { useState, useEffect } from "react";
import { Eye, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/formatters";

const MenuPreviewCard = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("Entrega Rápida");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const loadCompanyData = () => {
    const savedName = localStorage.getItem("companyName");
    const savedAddress = localStorage.getItem("companyAddress");
    const savedPhone = localStorage.getItem("companyPhone");
    const savedLogo = localStorage.getItem("companyLogo");
    
    if (savedName) setCompanyName(savedName);
    if (savedAddress) setCompanyAddress(savedAddress);
    if (savedPhone) setCompanyPhone(savedPhone);
    if (savedLogo) setLogoPreview(savedLogo);
  };

  const loadMenuItems = () => {
    const savedProducts = localStorage.getItem("products");
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
          imageUrl: imageUrl
        };
      });
      setMenuItems(updatedItems);
    }
  };

  useEffect(() => {
    loadCompanyData();
    loadMenuItems();

    const handleProductsUpdate = () => {
      loadMenuItems();
    };

    window.addEventListener("productsUpdated", handleProductsUpdate);
    return () => window.removeEventListener("productsUpdated", handleProductsUpdate);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualização do Cardápio Online</CardTitle>
        <CardDescription>
          Visualize como seu cardápio aparecerá para os clientes antes de compartilhá-lo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Prévia do Cardápio</h3>
            <p className="text-sm text-muted-foreground">
              Veja exatamente como seus produtos aparecerão para os clientes.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visualizar Cardápio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Prévia do Cardápio Online</DialogTitle>
                <DialogDescription>
                  Esta é uma prévia de como seus produtos aparecerão para os clientes.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Cabeçalho da empresa */}
                <div className="text-center space-y-2 border-b pb-4">
                  {logoPreview && (
                    <div className="flex justify-center">
                      <img src={logoPreview} alt="Logo" className="h-16 w-auto" />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold">{companyName}</h2>
                  {companyAddress && (
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {companyAddress}
                    </p>
                  )}
                  {companyPhone && (
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Phone className="h-3 w-3" />
                      {companyPhone}
                    </p>
                  )}
                </div>

                {/* Lista de produtos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Nossos Produtos</h3>
                  {menuItems.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      <p>Nenhum produto cadastrado ainda.</p>
                      <p className="text-sm">Adicione produtos na página "Produtos" para vê-los aqui.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {menuItems.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden">
                          <div className="relative pt-[60%]">
                            <img
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.name}
                              className="absolute inset-0 h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-lg mb-2">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-xl font-bold text-primary">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuPreviewCard;
