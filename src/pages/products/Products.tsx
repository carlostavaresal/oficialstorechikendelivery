
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductsList from "@/components/products/ProductsList";
import AddProductModal from "@/components/products/AddProductModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const Products = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
            <p className="text-muted-foreground">
              Gerenciamento dos produtos disponíveis para venda
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2" />
            Adicionar Produto
          </Button>
        </div>
        <Separator />
        
        <ProductsList />
        <AddProductModal open={showAddModal} onOpenChange={setShowAddModal} />
      </div>
    </DashboardLayout>
  );
};

export default Products;
