
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Percent, BadgePercent, Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PromotionalCodeModal, { PromoCode } from "@/components/promotions/PromotionalCodeModal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";

const PromotionalCodes = () => {
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  // Carrega códigos do localStorage
  useEffect(() => {
    const savedPromoCodes = localStorage.getItem("promoCodes");
    if (savedPromoCodes) {
      try {
        const parsed = JSON.parse(savedPromoCodes);
        // Convert string dates to Date objects
        const parsedWithDates = parsed.map((promo: any) => ({
          ...promo,
          expiresAt: promo.expiresAt ? new Date(promo.expiresAt) : null,
        }));
        setPromoCodes(parsedWithDates);
      } catch (error) {
        console.error("Erro ao carregar códigos promocionais:", error);
      }
    }
  }, []);

  // Salva códigos no localStorage
  useEffect(() => {
    if (promoCodes.length > 0) {
      localStorage.setItem("promoCodes", JSON.stringify(promoCodes));
    }
  }, [promoCodes]);

  const handleAddPromo = (promo: PromoCode) => {
    setPromoCodes([...promoCodes, promo]);
  };

  const handleEditPromo = (promo: PromoCode) => {
    setPromoCodes(promoCodes.map(p => p.id === promo.id ? promo : p));
  };

  const handleSavePromo = (promo: PromoCode) => {
    if (editingPromo) {
      handleEditPromo(promo);
    } else {
      handleAddPromo(promo);
    }
  };

  const handleDeletePromo = (id: string) => {
    setPromoCodes(promoCodes.filter(p => p.id !== id));
    toast({
      title: "Código promocional excluído",
      description: "O código promocional foi excluído com sucesso",
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Sem validade";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const isExpired = (promo: PromoCode) => {
    if (!promo.expiresAt) return false;
    return new Date(promo.expiresAt) < new Date();
  };

  const isAtMaxUses = (promo: PromoCode) => {
    if (promo.maxUses === 0) return false;
    return promo.currentUses >= promo.maxUses;
  };

  const getPromoStatus = (promo: PromoCode) => {
    if (!promo.active) return "inactive";
    if (isExpired(promo)) return "expired";
    if (isAtMaxUses(promo)) return "depleted";
    return "active";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "expired": return "destructive";
      case "depleted": return "outline";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "inactive": return "Inativo";
      case "expired": return "Expirado";
      case "depleted": return "Esgotado";
      default: return "Desconhecido";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <HomeIcon className="h-3 w-3 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Códigos Promocionais</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Códigos Promocionais</h2>
            <p className="text-muted-foreground">
              Gerencie descontos e promoções para seus clientes
            </p>
          </div>
          <Button onClick={() => {
            setEditingPromo(null);
            setShowAddModal(true);
          }}>
            <Plus className="mr-2" />
            Novo Código
          </Button>
        </div>
        <Separator />
        
        <div className="rounded-lg border bg-card shadow">
          {promoCodes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <BadgePercent className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Sem códigos promocionais</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não criou nenhum código promocional.
              </p>
              <Button onClick={() => {
                setEditingPromo(null);
                setShowAddModal(true);
              }}>
                Criar Primeiro Código
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promo) => {
                    const status = getPromoStatus(promo);
                    return (
                      <TableRow key={promo.id}>
                        <TableCell className="font-medium">{promo.code}</TableCell>
                        <TableCell>
                          {promo.type === "percentage" ? (
                            <div className="flex items-center">
                              <Percent className="h-4 w-4 mr-1" />
                              <span>{promo.discount}%</span>
                            </div>
                          ) : (
                            <span>R$ {promo.discount.toFixed(2)}</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(promo.expiresAt)}</TableCell>
                        <TableCell>
                          {promo.maxUses > 0 ? (
                            `${promo.currentUses} / ${promo.maxUses}`
                          ) : (
                            `${promo.currentUses} / Ilimitado`
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(status)}>
                            {getStatusLabel(status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingPromo(promo);
                                setShowAddModal(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePromo(promo.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <PromotionalCodeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSavePromo}
        initialPromo={editingPromo}
      />
    </DashboardLayout>
  );
};

export default PromotionalCodes;
