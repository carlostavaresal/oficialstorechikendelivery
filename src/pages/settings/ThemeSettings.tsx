
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Palette } from "lucide-react";
import ColorPalette, { COLOR_THEMES, ColorTheme } from "@/components/settings/ColorPalette";
import { applyTheme, initializeTheme } from "@/lib/themeUtils";

const ThemeSettings: React.FC = () => {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<string>('purple');
  const [autoApply, setAutoApply] = useState<boolean>(true);
  const [previewTheme, setPreviewTheme] = useState<string>('purple');

  useEffect(() => {
    // Initialize theme from localStorage
    const currentTheme = initializeTheme();
    setSelectedTheme(currentTheme);
    setPreviewTheme(currentTheme);
  }, []);

  const handleThemeSelect = (theme: ColorTheme) => {
    setPreviewTheme(theme.id);
    
    if (autoApply) {
      applyTheme(theme.id);
      setSelectedTheme(theme.id);
      
      toast({
        title: "Tema aplicado",
        description: `O tema "${theme.name}" foi aplicado com sucesso.`,
      });
    }
  };

  const handleApplyTheme = () => {
    applyTheme(previewTheme);
    setSelectedTheme(previewTheme);
    
    toast({
      title: "Tema aplicado",
      description: `O tema "${COLOR_THEMES.find(t => t.id === previewTheme)?.name}" foi aplicado com sucesso.`,
    });
  };

  const toggleAutoApply = () => {
    setAutoApply(!autoApply);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações de Tema</h2>
          <p className="text-muted-foreground">
            Personalize as cores do seu aplicativo de delivery para melhor atender seus clientes.
          </p>
        </div>
        <Separator />
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Paleta de Cores</CardTitle>
            </div>
            <CardDescription>
              Escolha um tema de cores que melhor represente sua marca e agrade seus clientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-apply"
                checked={autoApply}
                onCheckedChange={toggleAutoApply}
              />
              <Label htmlFor="auto-apply">Aplicar automaticamente ao selecionar</Label>
            </div>
            
            <ColorPalette
              selectedThemeId={previewTheme}
              onSelectTheme={handleThemeSelect}
            />
            
            {!autoApply && (
              <Button 
                onClick={handleApplyTheme}
                disabled={previewTheme === selectedTheme}
                className="w-full mt-4"
              >
                Aplicar Tema
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Visualização dos Elementos da Interface</CardTitle>
            <CardDescription>
              Veja como os elementos da interface ficarão com o tema selecionado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Botão Primário</h3>
                <Button>Botão Principal</Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Botão Secundário</h3>
                <Button variant="secondary">Botão Secundário</Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Botão Outline</h3>
                <Button variant="outline">Botão Outline</Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Rótulos</h3>
                <Label>Exemplo de Rótulo</Label>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Card</h3>
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                  Conteúdo do Card
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Background</h3>
                <div className="rounded-lg border bg-background p-3 text-foreground">
                  Fundo da aplicação
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ThemeSettings;
