
import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  MapPin,
  CreditCard,
  ClipboardList,
  Palette,
  Menu,
  X,
  Lock,
  BookOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    setIsCollapsed(true);
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Pedidos", path: "/orders", icon: ShoppingCart },
    { name: "Produtos", path: "/products", icon: Package },
    { name: "Áreas de Entrega", path: "/delivery", icon: MapPin },
    { name: "Métodos de Pagamento", path: "/payment", icon: CreditCard },
    { name: "Cardápio Online", path: "/menu", icon: BookOpen },
    { name: "Histórico", path: "/history", icon: ClipboardList },
    { name: "Configurações", path: "/settings", icon: Settings },
    { name: "Tema", path: "/settings/theme", icon: Palette },
    { name: "Segurança", path: "/security", icon: Lock },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col space-y-2 bg-sidebar-background text-sidebar-foreground h-full border-r border-sidebar-border transition-all",
        isCollapsed ? "w-16" : "w-60",
        !isMobile ? "sticky top-0" : "fixed inset-y-0 left-0 z-50",
        isMobile && isCollapsed ? "hidden" : "",
        isMobile && !isCollapsed ? "w-full bg-background/80 backdrop-blur-sm" : "",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-80 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-left-0",
        "px-2 py-4",
        "overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-muted",
        className
      )}
    >
      {isMobile && (
        <div className="mb-4 flex justify-end">
          <Button variant="ghost" size="icon" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      <div className="mb-8">
        <Link to="/" className="flex items-center justify-center">
          <span className="font-bold text-xl tracking-tight">
            {isCollapsed ? "Delivery" : "Painel Delivery"}
          </span>
        </Link>
      </div>
      <div className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 rounded-md p-2 font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {!isMobile && (
        <div className="p-3">
          <Button variant="outline" className="w-full" onClick={toggleSidebar}>
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <Settings className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </aside>
  );
}
