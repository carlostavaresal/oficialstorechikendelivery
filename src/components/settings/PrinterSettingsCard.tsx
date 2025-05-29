
import React, { useState, useRef, useEffect } from "react";
import { Printer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";

const PrinterSettingsCard = () => {
  const { toast } = useToast();
  const [printerWidth, setPrinterWidth] = useState("80");
  const [printerHeight, setPrinterHeight] = useState("8");
  const printPreviewRef = useRef<HTMLDivElement>(null);

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

  const handlePrintTest = () => {
    if (!printPreviewRef.current) return;
    
    const companyName = localStorage.getItem("companyName") || "Entrega Rápida";
    const logoPreview = localStorage.getItem("companyLogo");
    
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

  useEffect(() => {
    const savedWidth = localStorage.getItem("printerWidth");
    const savedHeight = localStorage.getItem("printerHeight");
    
    if (savedWidth) setPrinterWidth(savedWidth);
    if (savedHeight) setPrinterHeight(savedHeight);
  }, []);

  return (
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
  );
};

export default PrinterSettingsCard;
