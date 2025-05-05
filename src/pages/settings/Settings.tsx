
import React, { useState } from "react";
import { Upload, FileImage, UploadCloud } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Entrega Rápida");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter menos de 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Formato inválido",
          description: "Por favor, envie apenas arquivos de imagem.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        
        // Here you would typically upload to a server and get a URL back
        // For now, we're just storing in localStorage for demo purposes
        localStorage.setItem("companyLogo", e.target?.result as string);
        localStorage.setItem("companyName", companyName);
        
        toast({
          title: "Logo atualizado",
          description: "O logotipo da empresa foi atualizado com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleSaveCompanyInfo = () => {
    localStorage.setItem("companyName", companyName);
    toast({
      title: "Informações salvas",
      description: "As informações da empresa foram atualizadas com sucesso.",
    });
  };

  React.useEffect(() => {
    // Load saved logo and company name on component mount
    const savedLogo = localStorage.getItem("companyLogo");
    const savedName = localStorage.getItem("companyName");
    
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
    
    if (savedName) {
      setCompanyName(savedName);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações e informações da sua empresa.
          </p>
        </div>
        <Separator />
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua empresa que serão exibidas aos clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input 
                  id="company-name" 
                  value={companyName} 
                  onChange={handleNameChange} 
                  placeholder="Nome da sua empresa" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logotipo da Empresa</Label>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <FileImage className="h-10 w-10 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">
                          Nenhum logo<br />carregado
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent">
                          <UploadCloud className="h-4 w-4" />
                          <span>Carregar logo</span>
                        </div>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Recomendado: 300x300 pixels, JPG ou PNG, máximo de 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveCompanyInfo}>Salvar Informações</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
