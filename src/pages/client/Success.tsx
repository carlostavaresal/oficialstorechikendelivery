
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCheck, ShoppingCart, ArrowLeft } from "lucide-react";
import ClientLayout from "@/components/layout/ClientLayout";

const Success = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear any residual cart data to ensure clean state
    localStorage.removeItem('cart');
  }, []);
  
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="rounded-full bg-green-100 p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
            <CheckCheck size={48} className="text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Pedido Recebido!</h1>
          
          <p className="text-muted-foreground mb-8">
            Seu pedido foi recebido e está sendo processado. 
            Em breve entraremos em contato pelo número de telefone informado
            para confirmar os detalhes da entrega.
          </p>
          
          <div className="space-y-4">
            <Button onClick={() => navigate('/client')} className="w-full">
              <ArrowLeft className="mr-2" />
              Voltar ao Cardápio
            </Button>
            
            <Button onClick={() => navigate('/client')} variant="outline" className="w-full">
              <ShoppingCart className="mr-2" />
              Fazer Novo Pedido
            </Button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Success;
