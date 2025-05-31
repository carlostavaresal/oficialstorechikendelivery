
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { MessageCircle, Save } from 'lucide-react';

const WhatsAppSettingsCard = () => {
  const { toast } = useToast();
  const { settings, loading, updateSettings } = useCompanySettings();
  const [formData, setFormData] = useState({
    whatsapp_number: settings?.whatsapp_number || '',
    company_name: settings?.company_name || '',
    company_address: settings?.company_address || '',
    delivery_fee: settings?.delivery_fee?.toString() || '0',
    minimum_order: settings?.minimum_order?.toString() || '0'
  });

  React.useEffect(() => {
    if (settings) {
      setFormData({
        whatsapp_number: settings.whatsapp_number || '',
        company_name: settings.company_name || '',
        company_address: settings.company_address || '',
        delivery_fee: settings.delivery_fee?.toString() || '0',
        minimum_order: settings.minimum_order?.toString() || '0'
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!formData.whatsapp_number) {
      toast({
        title: "Erro",
        description: "Número do WhatsApp é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const success = await updateSettings({
      whatsapp_number: formData.whatsapp_number,
      company_name: formData.company_name,
      company_address: formData.company_address,
      delivery_fee: parseFloat(formData.delivery_fee) || 0,
      minimum_order: parseFloat(formData.minimum_order) || 0
    });

    if (success) {
      toast({
        title: "Configurações salvas",
        description: "As configurações da empresa foram atualizadas com sucesso",
      });
    } else {
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Configurações do WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Configurações do WhatsApp e Empresa
        </CardTitle>
        <CardDescription>
          Configure o número do WhatsApp para onde os pedidos serão enviados e informações da empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">Número do WhatsApp *</Label>
          <Input
            id="whatsapp"
            type="tel"
            placeholder="5511999999999"
            value={formData.whatsapp_number}
            onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
          />
          <p className="text-sm text-muted-foreground">
            Digite o número com código do país (ex: 5511999999999 para Brasil)
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="company_name">Nome da Empresa</Label>
          <Input
            id="company_name"
            type="text"
            placeholder="Minha Empresa"
            value={formData.company_name}
            onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_address">Endereço da Empresa</Label>
          <Input
            id="company_address"
            type="text"
            placeholder="Rua, número, bairro, cidade"
            value={formData.company_address}
            onChange={(e) => setFormData(prev => ({ ...prev, company_address: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delivery_fee">Taxa de Entrega (R$)</Label>
            <Input
              id="delivery_fee"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.delivery_fee}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_fee: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimum_order">Pedido Mínimo (R$)</Label>
            <Input
              id="minimum_order"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.minimum_order}
              onChange={(e) => setFormData(prev => ({ ...prev, minimum_order: e.target.value }))}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettingsCard;
