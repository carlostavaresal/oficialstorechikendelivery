
import React from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-b from-primary/80 to-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Entrega Rápida</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Sistema completo de pedidos online para seu delivery
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} size="lg">
                Acessar Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => navigate("/login")} size="lg">
                Acessar Sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            <Button 
              onClick={() => navigate("/client")} 
              variant="secondary" 
              size="lg"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ver Cardápio
            </Button>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Cardápio Digital</h2>
              <p className="mb-6 text-muted-foreground">
                Compartilhe seu cardápio digital com seus clientes de forma fácil e rápida.
                Eles podem fazer pedidos diretamente pelo celular, sem precisar baixar nenhum aplicativo.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">QR Code para Acesso Rápido</h3>
                    <p className="text-sm text-muted-foreground">
                      Crie um QR code para seus clientes acessarem o cardápio rapidamente
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Pedidos Online</h3>
                    <p className="text-sm text-muted-foreground">
                      Receba pedidos online diretamente no seu painel de controle
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button onClick={() => navigate("/client")} variant="default">
                  Experimentar Cardápio
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-64 h-96 border-8 border-black rounded-3xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-white overflow-hidden">
                  <div className="absolute top-0 w-full h-6 bg-black"></div>
                  <div className="pt-8 px-3 flex flex-col items-center">
                    <div className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg text-center text-lg font-semibold mb-3">
                      Entrega Rápida
                    </div>
                    <div className="w-full bg-gray-100 rounded-lg p-2 mb-3">
                      <div className="h-24 bg-gray-200 rounded-lg mb-2"></div>
                      <div className="h-4 w-3/4 bg-gray-300 rounded-full mb-1"></div>
                      <div className="h-3 w-1/2 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-lg p-2 mb-3">
                      <div className="h-24 bg-gray-200 rounded-lg mb-2"></div>
                      <div className="h-4 w-3/4 bg-gray-300 rounded-full mb-1"></div>
                      <div className="h-3 w-1/2 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-10 left-0 right-0 px-3">
                      <div className="bg-primary text-primary-foreground py-3 rounded-lg text-center">
                        Ver Cardápio Completo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-muted py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>© 2025 Entrega Rápida. Todos os direitos reservados.</p>
            <p className="text-sm mt-1">
              Sistema de entregas e pedidos online
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
