
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

const mockProducts: TopProduct[] = [
  { name: "Hambúrguer Artesanal", quantity: 85, percentage: 100 },
  { name: "Pizza Margherita", quantity: 72, percentage: 85 },
  { name: "Açaí 500ml", quantity: 56, percentage: 66 },
  { name: "Batata Frita", quantity: 43, percentage: 51 },
  { name: "Refrigerante 350ml", quantity: 39, percentage: 46 },
];

const TopProducts: React.FC = () => {
  return (
    <Card className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <CardTitle>Produtos Mais Vendidos</CardTitle>
        <CardDescription>Top 5 produtos mais vendidos esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockProducts.map((product) => (
            <div key={product.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-muted-foreground">{product.quantity} vendas</span>
              </div>
              <Progress value={product.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
