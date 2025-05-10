
import React, { useState } from "react";
import { QrCode, Link as LinkIcon, Image, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const ShareMenu: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const menuUrl = window.location.href;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Generate QR code for the current URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Compartilhar Cardápio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Cardápio Online</DialogTitle>
          <DialogDescription>
            Compartilhe o cardápio online para que seus clientes possam fazer pedidos.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="qrcode" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="image">Logotipo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="qrcode" className="py-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="border border-border p-3 rounded-md bg-white">
                <img src={qrCodeUrl} alt="QR Code do cardápio" className="w-52 h-52" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Escaneie este QR code para acessar o cardápio online
              </p>
              <Button onClick={() => {
                const link = document.createElement('a');
                link.href = qrCodeUrl;
                link.download = 'cardapio-qrcode.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }} variant="outline" className="w-full">
                Baixar QR Code
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="py-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Copie este link e compartilhe com seus clientes
              </p>
              <div className="flex gap-2">
                <Input value={menuUrl} readOnly className="flex-1" />
                <Button onClick={handleCopyLink} variant="secondary" className="flex-shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="border border-border p-4 rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary">Entrega Rápida</h3>
                  <p className="text-sm mt-2">Cardápio Digital</p>
                  <div className="mt-4 bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm">
                    Escaneie ou Clique para Pedir
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Imagem do logotipo com acesso ao cardápio
              </p>
              <Button onClick={() => {
                // In a real app, we would generate a proper image here
                alert("Em uma aplicação real, um arquivo de imagem seria baixado aqui.");
              }} variant="outline" className="w-full">
                Baixar Imagem
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4">
          <p className="text-xs text-muted-foreground text-center">
            Os clientes podem fazer pedidos diretamente pelo cardápio online
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMenu;
