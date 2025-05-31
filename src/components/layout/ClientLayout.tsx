
import React from "react";
import { Link } from "react-router-dom";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/client" className="text-2xl font-bold">
            Entrega Rápida
          </Link>
        </div>
      </header>
      
      <main className="flex-grow bg-muted/30">
        {children}
      </main>
      
      <footer className="bg-background py-6 border-t">
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

export default ClientLayout;
