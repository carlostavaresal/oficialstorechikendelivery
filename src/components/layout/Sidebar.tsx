
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Package,
  LayoutDashboard,
  Settings,
  Map,
  CreditCard,
  LogOut,
  History,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  children,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold">Entrega Rápida</h1>
      </div>
      <nav className="flex-1 overflow-auto py-2 px-4 space-y-1">
        <SidebarLink to="/" icon={LayoutDashboard}>
          Dashboard
        </SidebarLink>
        <SidebarLink to="/orders" icon={Package}>
          Pedidos
        </SidebarLink>
        <SidebarLink to="/products" icon={ShoppingCart}>
          Produtos
        </SidebarLink>
        <SidebarLink to="/delivery" icon={Map}>
          Áreas de Entrega
        </SidebarLink>
        <SidebarLink to="/payment" icon={CreditCard}>
          Formas de Pagamento
        </SidebarLink>
        <SidebarLink to="/history" icon={History}>
          Histórico
        </SidebarLink>
        <SidebarLink to="/settings" icon={Settings}>
          Configurações
        </SidebarLink>
        
        <div className="pt-4 mt-4 border-t">
          <Link 
            to="/client" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Área do Cliente</span>
          </Link>
        </div>
      </nav>
      <div className="p-4 mt-auto border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
