
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Product } from "@/components/products/ProductsList";
import ClientLayout from "@/components/layout/ClientLayout";
import { useToast } from "@/hooks/use-toast";

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<{id: string, quantity: number, notes: string}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load cart from localStorage with the same key used by Checkout
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Load products from localStorage
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      // Filter only available products
      const availableProducts = parsedProducts.filter((product: Product) => product.is_available !== false);
      setProducts(availableProducts);
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes with the same key used by Checkout
  useEffect(() => {
    // Create cart items with full product information for checkout
    const cartWithProducts = cart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.id);
      if (product) {
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: cartItem.quantity,
          notes: cartItem.notes
        };
      }
      return null;
    }).filter(Boolean);
    
    localStorage.setItem('cart', JSON.stringify(cartWithProducts));
  }, [cart, products]);

  const addToCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { id: productId, quantity: 1, notes: '' }];
      }
    });
    
    toast({
      title: "Produto adicionado",
      description: "Item adicionado ao seu carrinho",
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  const getCartQuantity = (productId: string) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Carregando produtos...</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Nossos Produtos</h1>
          <Link to="/client/checkout">
            <Button className="relative" variant="default">
              <ShoppingCart className="mr-2" />
              Carrinho
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Nenhum produto disponível no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="relative pt-[60%]">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4 flex-grow">
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="mt-2">{product.description}</CardDescription>
                  <p className="mt-4 text-xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 border-t">
                  {getCartQuantity(product.id) > 0 ? (
                    <div className="flex items-center justify-between w-full">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold">
                        {getCartQuantity(product.id)}
                      </span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => addToCart(product.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(product.id)}
                    >
                      Adicionar ao Pedido
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default Catalog;
