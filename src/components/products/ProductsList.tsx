
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ProductCard from "./ProductCard";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load products from localStorage
    const loadProducts = () => {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
      setIsLoading(false);
    };

    loadProducts();

    // Set up an event listener to update the products list when products are added/edited/deleted
    window.addEventListener("productsUpdated", loadProducts);
    
    return () => {
      window.removeEventListener("productsUpdated", loadProducts);
    };
  }, []);

  if (isLoading) {
    return <p>Carregando produtos...</p>;
  }

  if (products.length === 0) {
    return (
      <Card className="flex h-40 items-center justify-center text-center">
        <div className="p-6">
          <p className="text-lg font-medium">Nenhum produto cadastrado</p>
          <p className="text-sm text-muted-foreground">
            Adicione produtos usando o botão "Adicionar Produto" acima.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
