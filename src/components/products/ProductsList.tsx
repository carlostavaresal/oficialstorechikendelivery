
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  is_available?: boolean;
}

const ProductsList = () => {
  const { products, loading } = useProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Se não há produtos no Supabase, carregar do localStorage como fallback
    if (!loading && products.length === 0) {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        const formattedProducts = parsedProducts.map((product: any) => {
          let imageUrl = '';
          
          // Processar a imagem corretamente
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
            image: imageUrl,
            is_available: product.is_available !== false
          };
        });
        setLocalProducts(formattedProducts);
      }
    }
  }, [products, loading]);

  // Usar produtos do Supabase se disponíveis, senão usar do localStorage
  const displayProducts = products.length > 0 ? 
    products.map(product => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description || '',
      image: product.image_url || '',
      category: product.category || 'Geral'
    })) : localProducts;

  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  if (displayProducts.length === 0) {
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
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
