
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TopProduct {
  name: string;
  quantity: number;
  percentage: number;
}

const TopProducts: React.FC = () => {
  // Start with empty products array
  const products: TopProduct[] = [];

  return (
    <Card className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <CardTitle>Produtos Mais Vendidos</CardTitle>
        <CardDescription>Top 5 produtos mais vendidos esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Nenhum produto vendido ainda</p>
            <p className="text-sm mt-1">Os produtos mais vendidos aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-muted-foreground">{product.quantity} vendas</span>
                </div>
                <Progress value={product.percentage} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProducts;
