
import React, { useState, useEffect } from "react";
import { BadgePercent, Plus, Edit, Trash2, Gift } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PromotionalCodeModal, { PromoCode } from "@/components/promotions/PromotionalCodeModal";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

const PromotionalCodes = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load saved promo codes from localStorage
    const savedPromoCodes = localStorage.getItem("promoCodes");
    if (savedPromoCodes) {
      try {
        const parsedCodes = JSON.parse(savedPromoCodes).map((promo: any) => ({
          ...promo,
          expiresAt: promo.expiresAt ? new Date(promo.expiresAt) : null,
        }));
        setPromoCodes(parsedCodes);
      } catch (error) {
        console.error("Erro ao carregar códigos promocionais:", error);
      }
    }
  }, []);

  const savePromoCodesToStorage = (codes: PromoCode[]) => {
    localStorage.setItem("promoCodes", JSON.stringify(codes));
  };

  const handleAddPromoCode = () => {
    setSelectedPromo(null);
    setIsModalOpen(true);
  };

  const handleEditPromoCode = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const handleDeletePromoCode = (id: string) => {
    const updatedCodes = promoCodes.filter((code) => code.id !== id);
    setPromoCodes(updatedCodes);
    savePromoCodesToStorage(updatedCodes);
    
    toast({
      title: "Código promocional excluído",
      description: "O código promocional foi excluído com sucesso",
    });
  };

  const handleSavePromoCode = (promo: PromoCode) => {
    let updatedCodes: PromoCode[];
    
    if (promoCodes.some((code) => code.id === promo.id)) {
      // Update existing promo code
      updatedCodes = promoCodes.map((code) =>
        code.id === promo.id ? promo : code
      );
    } else {
      // Add new promo code
      updatedCodes = [...promoCodes, promo];
    }
    
    setPromoCodes(updatedCodes);
    savePromoCodesToStorage(updatedCodes);
  };

  const filteredCodes = promoCodes.filter((code) =>
    code.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BadgePercent className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Códigos Promocionais</h1>
          </div>
          <Button onClick={handleAddPromoCode}>
            <Plus className="mr-2 h-4 w-4" /> Novo Código
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Gerenciar Códigos</CardTitle>
              <div className="w-72">
                <Input
                  placeholder="Pesquisar códigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {filteredCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {promoCodes.length === 0 ? (
                        <div className="flex flex-col items-center">
                          <Gift className="h-12 w-12 mb-2 text-muted-foreground/50" />
                          <p>Nenhum código promocional cadastrado</p>
                          <Button variant="link" onClick={handleAddPromoCode}>
                            Criar novo código
                          </Button>
                        </div>
                      ) : (
                        "Nenhum resultado encontrado"
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.code}</TableCell>
                      <TableCell>
                        {promo.type === "percentage"
                          ? `${promo.discount}%`
                          : `R$ ${promo.discount.toFixed(2)}`}
                      </TableCell>
                      <TableCell>
                        {promo.expiresAt
                          ? new Date(promo.expiresAt).toLocaleDateString()
                          : "Sem data"}
                      </TableCell>
                      <TableCell>
                        {promo.maxUses > 0 
                          ? `${promo.currentUses} / ${promo.maxUses}`
                          : `${promo.currentUses} / ∞`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={promo.active ? "default" : "secondary"}>
                          {promo.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPromoCode(promo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePromoCode(promo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <PromotionalCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePromoCode}
          initialPromo={selectedPromo}
        />
      </div>
    </DashboardLayout>
  );
};

export default PromotionalCodes;
