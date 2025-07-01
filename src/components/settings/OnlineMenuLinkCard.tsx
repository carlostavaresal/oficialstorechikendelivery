
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, QrCode, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const OnlineMenuLinkCard = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const menuUrl = `${window.location.origin}/client`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Link copiado",
      description: "Link do cardápio copiado para a área de transferência",
    });
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'cardapio-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code baixado",
      description: "QR Code do cardápio foi baixado com sucesso",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Link do Cardápio Online
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Link para compartilhar com clientes:</label>
          <div className="flex gap-2">
            <Input 
              value={menuUrl} 
              readOnly 
              className="flex-1 bg-muted"
            />
            <Button 
              onClick={handleCopyLink} 
              variant="outline"
              className="flex-shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => window.open(menuUrl, '_blank')} 
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Visualizar Cardápio
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>QR Code do Cardápio</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="border border-border p-3 rounded-md bg-white">
                  <img src={qrCodeUrl} alt="QR Code do cardápio" className="w-52 h-52" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Escaneie este QR code para acessar o cardápio online
                </p>
                <Button onClick={handleDownloadQR} className="w-full">
                  Baixar QR Code
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Compartilhe este link com seus clientes para que possam fazer pedidos online</p>
          <p>• O QR Code pode ser impresso e colado em mesas, cardápios físicos ou na entrada do estabelecimento</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnlineMenuLinkCard;
