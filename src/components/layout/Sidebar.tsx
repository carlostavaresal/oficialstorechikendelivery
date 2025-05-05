
import React from "react";
import { Link } from "react-router-dom";
import { Box, Calendar, Clock, Home, Package, Settings, ShoppingCart, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/", active: true },
    { icon: ShoppingCart, label: "Pedidos", href: "/orders", badge: "12" },
    { icon: Box, label: "Produtos", href: "/products" },
    { icon: Calendar, label: "Agendamentos", href: "/schedule" },
    { icon: Truck, label: "Entregas", href: "/deliveries" },
    { icon: Clock, label: "Histórico", href: "/history" },
    { icon: Settings, label: "Configurações", href: "/settings" },
  ];

  return (
    <SidebarComponent>
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Entrega Rápida</span>
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
                        item.active && "bg-accent"
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
    </SidebarComponent>
  );
};

export default Sidebar;
