import React, { useState, useRef } from "react";
import { Upload, FileImage, UploadCloud, Printer, Palette, Eye, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/formatters";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Entrega Rápida");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [printerWidth, setPrinterWidth] = useState("80");
  const [printerHeight, setPrinterHeight] = useState("8");
  const printPreviewRef = useRef<HTMLDivElement>(null);

  // Estado para os produtos do cardápio
  const [menuItems, setMenuItems] = useState<any[]>(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      return products.map((product: any) => {
        let imageUrl = '';
        
        if (product.image) {
          if (typeof product.image === 'string') {
            imageUrl = product.image;
          } else if (typeof product.image === 'object') {
            if (product.image.value) {
              imageUrl = product.image.value;
            } else if (product.image._type === 'String' && product.image.value) {
              imageUrl = product.image.value;
            }
          }
        }
        
        return {
          id: product.id,
          name: product.name || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          category: product.category || "Geral",
          imageUrl: imageUrl
        };
      });
    }
    return [];
  });

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
        localStorage.setItem("companyLogo", e.target?.result as string);
        
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyAddress(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyPhone(e.target.value);
  };

  const handlePrinterWidthChange = (value: string) => {
    setPrinterWidth(value);
    localStorage.setItem("printerWidth", value);
    toast({
      title: "Configuração salva",
      description: "Largura da impressora atualizada.",
    });
  };

  const handlePrinterHeightChange = (value: string) => {
    setPrinterHeight(value);
    localStorage.setItem("printerHeight", value);
    toast({
      title: "Configuração salva",
      description: "Altura do recibo atualizada.",
    });
  };

  const handleSaveCompanyInfo = () => {
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("companyAddress", companyAddress);
    localStorage.setItem("companyPhone", companyPhone);
    localStorage.setItem("printerWidth", printerWidth);
    localStorage.setItem("printerHeight", printerHeight);
    toast({
      title: "Informações salvas",
      description: "As informações da empresa foram atualizadas com sucesso.",
    });
  };

  const handlePrintTest = () => {
    if (!printPreviewRef.current) return;
    
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão. Verifique se os pop-ups estão permitidos.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write('<html><head><title>Impressão de Teste</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { 
        font-family: monospace; 
        width: ${printerWidth}mm; 
        margin: 0; 
        padding: 8px;
      }
      .receipt {
        text-align: center;
        border: 1px dashed #ccc;
        padding: 10px;
      }
      .logo { 
        max-width: 60%; 
        height: auto; 
        margin-bottom: 10px;
      }
      .title { 
        font-size: 16px; 
        font-weight: bold;
        margin-bottom: 10px;
      }
      .item { 
        display: flex; 
        justify-content: space-between;
        margin: 5px 0; 
        text-align: left;
      }
      .total { 
        font-weight: bold; 
        border-top: 1px dashed #000;
        padding-top: 5px;
        margin-top: 10px;
      }
      @media print {
        body { 
          width: ${printerWidth}mm; 
        }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<div class="receipt">');
    
    if (logoPreview) {
      printWindow.document.write(`<img src="${logoPreview}" class="logo" /><br />`);
    }
    
    printWindow.document.write(`<div class="title">${companyName}</div>`);
    printWindow.document.write('<div>-------------------------------</div>');
    printWindow.document.write('<div>Impressão de teste</div>');
    printWindow.document.write('<div>Data: ' + new Date().toLocaleDateString('pt-BR') + '</div>');
    printWindow.document.write('<div>Hora: ' + new Date().toLocaleTimeString('pt-BR') + '</div>');
    printWindow.document.write('<div>-------------------------------</div>');
    printWindow.document.write('<div class="item"><span>Item de teste</span><span>' + formatCurrency(15.90) + '</span></div>');
    printWindow.document.write('<div class="item"><span>2x Refrigerante</span><span>' + formatCurrency(10.00) + '</span></div>');
    printWindow.document.write('<div class="total item"><span>Total</span><span>' + formatCurrency(25.90) + '</span></div>');
    printWindow.document.write('<div>-------------------------------</div>');
    printWindow.document.write('<div>Obrigado pela preferência!</div>');
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleNavigateToThemeSettings = () => {
    navigate("/settings/theme");
  };

  React.useEffect(() => {
    // Load saved settings on component mount
    const savedLogo = localStorage.getItem("companyLogo");
    const savedName = localStorage.getItem("companyName");
    const savedAddress = localStorage.getItem("companyAddress");
    const savedPhone = localStorage.getItem("companyPhone");
    const savedWidth = localStorage.getItem("printerWidth");
    const savedHeight = localStorage.getItem("printerHeight");
    
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
    
    if (savedName) {
      setCompanyName(savedName);
    }

    if (savedAddress) {
      setCompanyAddress(savedAddress);
    }

    if (savedPhone) {
      setCompanyPhone(savedPhone);
    }

    if (savedWidth) {
      setPrinterWidth(savedWidth);
    }

    if (savedHeight) {
      setPrinterHeight(savedHeight);
    }

    // Atualizar produtos quando componente monta
    const handleProductsUpdate = () => {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        const updatedItems = products.map((product: any) => {
          let imageUrl = '';
          
          if (product.image) {
            if (typeof product.image === 'string') {
              imageUrl = product.image;
            } else if (typeof product.image === 'object') {
              if (product.image.value) {
                imageUrl = product.image.value;
              } else if (product.image._type === 'String' && product.image.value) {
                imageUrl = product.image.value;
              }
            }
          }
          
          return {
            id: product.id,
            name: product.name || '',
            description: product.description || '',
            price: Number(product.price) || 0,
            category: product.category || "Geral",
            imageUrl: imageUrl
          };
        });
        setMenuItems(updatedItems);
      }
    };

    handleProductsUpdate();
    window.addEventListener("productsUpdated", handleProductsUpdate);
    return () => window.removeEventListener("productsUpdated", handleProductsUpdate);
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Configure as informações básicas da sua empresa que serão exibidas aos clientes.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <Label htmlFor="company-phone">Telefone da Empresa</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="company-phone" 
                      value={companyPhone} 
                      onChange={handlePhoneChange} 
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-address">Endereço da Empresa</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="company-address" 
                    value={companyAddress} 
                    onChange={handleAddressChange} 
                    placeholder="Endereço completo da empresa"
                    className="pl-10"
                  />
                </div>
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

          <Card>
            <CardHeader>
              <CardTitle>Visualização do Cardápio Online</CardTitle>
              <CardDescription>
                Visualize como seu cardápio aparecerá para os clientes antes de compartilhá-lo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Prévia do Cardápio</h3>
                  <p className="text-sm text-muted-foreground">
                    Veja exatamente como seus produtos aparecerão para os clientes.
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Visualizar Cardápio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Prévia do Cardápio Online</DialogTitle>
                      <DialogDescription>
                        Esta é uma prévia de como seus produtos aparecerão para os clientes.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Cabeçalho da empresa */}
                      <div className="text-center space-y-2 border-b pb-4">
                        {logoPreview && (
                          <div className="flex justify-center">
                            <img src={logoPreview} alt="Logo" className="h-16 w-auto" />
                          </div>
                        )}
                        <h2 className="text-2xl font-bold">{companyName}</h2>
                        {companyAddress && (
                          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {companyAddress}
                          </p>
                        )}
                        {companyPhone && (
                          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                            <Phone className="h-3 w-3" />
                            {companyPhone}
                          </p>
                        )}
                      </div>

                      {/* Lista de produtos */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Nossos Produtos</h3>
                        {menuItems.length === 0 ? (
                          <div className="text-center p-8 text-muted-foreground">
                            <p>Nenhum produto cadastrado ainda.</p>
                            <p className="text-sm">Adicione produtos na página "Produtos" para vê-los aqui.</p>
                          </div>
                        ) : (
                          <div className="grid gap-4 md:grid-cols-2">
                            {menuItems.map((item) => (
                              <div key={item.id} className="border rounded-lg overflow-hidden">
                                <div className="relative pt-[60%]">
                                  <img
                                    src={item.imageUrl || "/placeholder.svg"}
                                    alt={item.name}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.svg";
                                    }}
                                  />
                                </div>
                                <div className="p-4">
                                  <h4 className="font-medium text-lg mb-2">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {item.description}
                                  </p>
                                  <p className="text-xl font-bold text-primary">
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Aparência e Tema</CardTitle>
                <CardDescription>
                  Personalize as cores e a aparência do seu aplicativo de delivery.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Tema e cores</h3>
                  <p className="text-sm text-muted-foreground">
                    Escolha um tema de cores que combine com a sua identidade visual.
                  </p>
                </div>
                <Button 
                  onClick={handleNavigateToThemeSettings} 
                  className="flex items-center gap-2"
                >
                  <Palette className="h-4 w-4" />
                  Personalizar Tema
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuração de Impressora</CardTitle>
              <CardDescription>
                Configure os parâmetros da impressora para impressão de recibos e pedidos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="printer-width">Largura do Papel</Label>
                  <Select value={printerWidth} onValueChange={handlePrinterWidthChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a largura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58">58mm</SelectItem>
                      <SelectItem value="80">80mm</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Largura padrão para impressoras térmicas.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt-height">Altura do Recibo</Label>
                  <Select value={printerHeight} onValueChange={handlePrinterHeightChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a altura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 cm</SelectItem>
                      <SelectItem value="12">12 cm</SelectItem>
                      <SelectItem value="15">15 cm</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Selecione "Automático" para altura baseada no conteúdo.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div ref={printPreviewRef} className="hidden">
                  {/* Conteúdo usado para prévia de impressão */}
                </div>
                <Button onClick={handlePrintTest} className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir Teste
                </Button>
                <p className="text-xs text-muted-foreground">
                  Isso abrirá uma janela de impressão com um recibo de teste.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
