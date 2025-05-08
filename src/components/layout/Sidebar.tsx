
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Calendar, Clock, History, Home, LogOut, Package, Settings, ShoppingCart, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Entrega Rápida");
  
  useEffect(() => {
    // Load company info from localStorage
    const savedLogo = localStorage.getItem("companyLogo");
    const savedName = localStorage.getItem("companyName");
    
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
    
    if (savedName) {
      setCompanyName(savedName);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/", },
    { icon: ShoppingCart, label: "Pedidos", href: "/orders", badge: "12" },
    { icon: Box, label: "Produtos", href: "/products" },
    { icon: Calendar, label: "Agendamentos", href: "/schedule" },
    { icon: Truck, label: "Entregas", href: "/deliveries" },
    { icon: History, label: "Histórico", href: "/history" },
    { icon: Settings, label: "Configurações", href: "/settings" },
  ];

  return (
    <SidebarComponent>
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt="Logo"
              className="h-8 w-8 rounded object-contain" 
            />
          ) : (
            <Package className="h-6 w-6 text-primary" />
          )}
          <span className="text-xl font-bold">{companyName}</span>
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm",
                        location.pathname === item.href && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="default" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="outline"
          className="w-full flex items-center justify-start text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
