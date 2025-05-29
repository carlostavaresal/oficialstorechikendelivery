
import React from "react";
import { Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ThemeSettingsCard = () => {
  const navigate = useNavigate();

  const handleNavigateToThemeSettings = () => {
    navigate("/settings/theme");
  };

  return (
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
  );
};

export default ThemeSettingsCard;
