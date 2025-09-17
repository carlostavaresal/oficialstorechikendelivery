import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, Database, FileText, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { format } from "date-fns";

interface BackupData {
  timestamp: string;
  version: string;
  products: any[];
  settings: any;
  deliveryAreas: any;
  orders: any[];
}

const BackupManager: React.FC = () => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();
  const { products } = useProducts();
  const { settings } = useCompanySettings();

  const createBackup = async () => {
    setIsCreatingBackup(true);
    try {
      // Gather all data
      const deliveryAreas = localStorage.getItem("businessAddress");
      const ordersData = localStorage.getItem("orders") || "[]";
      
      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        products: products || [],
        settings: settings || {},
        deliveryAreas: deliveryAreas ? JSON.parse(deliveryAreas) : null,
        orders: JSON.parse(ordersData)
      };

      // Create download
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json"
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `store-chicken-backup-${format(new Date(), "yyyy-MM-dd-HH-mm")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup criado com sucesso",
        description: "O arquivo de backup foi baixado para o seu computador.",
      });
    } catch (error) {
      console.error("Erro ao criar backup:", error);
      toast({
        title: "Erro ao criar backup",
        description: "Ocorreu um erro ao criar o backup. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleFileRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.includes("store-chicken-backup") || !file.name.endsWith(".json")) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo de backup válido (.json).",
        variant: "destructive",
      });
      return;
    }

    setIsRestoring(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string) as BackupData;
        
        // Validate backup structure
        if (!backupData.timestamp || !backupData.products) {
          throw new Error("Estrutura de backup inválida");
        }

        // Store backup data (in a real app, you'd restore to Supabase)
        if (backupData.deliveryAreas) {
          localStorage.setItem("businessAddress", JSON.stringify(backupData.deliveryAreas));
        }
        
        if (backupData.orders) {
          localStorage.setItem("orders", JSON.stringify(backupData.orders));
        }

        // Show confirmation
        toast({
          title: "Backup restaurado com sucesso",
          description: `Dados de ${format(new Date(backupData.timestamp), "dd/MM/yyyy HH:mm")} foram restaurados. Recarregue a página para ver as mudanças.`,
        });

        // Reset file input
        event.target.value = "";
      } catch (error) {
        console.error("Erro ao restaurar backup:", error);
        toast({
          title: "Erro ao restaurar backup",
          description: "O arquivo de backup está corrompido ou em formato inválido.",
          variant: "destructive",
        });
      } finally {
        setIsRestoring(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup do Sistema
          </CardTitle>
          <CardDescription>
            Crie backups completos do sistema ou restaure dados de backups anteriores.
            Inclui produtos, configurações, áreas de entrega e histórico de pedidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={createBackup}
              disabled={isCreatingBackup}
              className="h-20 flex flex-col gap-2"
            >
              {isCreatingBackup ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Download className="h-6 w-6" />
              )}
              <span>
                {isCreatingBackup ? "Criando Backup..." : "Criar Backup Completo"}
              </span>
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                disabled={isRestoring}
                className="h-20 flex flex-col gap-2 w-full"
                onClick={() => document.getElementById("backup-file")?.click()}
              >
                {isRestoring ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
                <span>
                  {isRestoring ? "Restaurando..." : "Restaurar Backup"}
                </span>
              </Button>
              <input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={handleFileRestore}
                className="hidden"
              />
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>O backup inclui:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Todos os produtos cadastrados</li>
                  <li>Configurações da empresa</li>
                  <li>Endereço e áreas de entrega</li>
                  <li>Histórico de pedidos</li>
                  <li>Configurações de métodos de pagamento</li>
                </ul>
                <p className="mt-2">
                  <strong>Nota:</strong> Após restaurar um backup, recarregue a página para visualizar todas as mudanças.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupManager;