
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ColorTheme = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  preview: string;
  description: string;
};

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "purple",
    name: "Roxo Delivery",
    colors: {
      primary: "267 100% 75%", // Purple
      secondary: "270 40% 96.1%",
      accent: "270 40% 96.1%",
      background: "0 0% 100%",
    },
    preview: "bg-gradient-to-r from-purple-500 to-purple-300",
    description: "O tema padrão com tons de roxo que transmitem elegância e modernidade."
  },
  {
    id: "blue",
    name: "Azul Oceano",
    colors: {
      primary: "210 100% 60%", // Blue
      secondary: "213 30% 96%",
      accent: "213 40% 95%",
      background: "0 0% 100%",
    },
    preview: "bg-gradient-to-r from-blue-500 to-blue-300",
    description: "Tons de azul que transmitem confiança, tranquilidade e profissionalismo."
  },
  {
    id: "green",
    name: "Verde Orgânico",
    colors: {
      primary: "142 76% 36%", // Green
      secondary: "140 20% 96%",
      accent: "140 30% 95%",
      background: "0 0% 100%",
    },
    preview: "bg-gradient-to-r from-green-600 to-green-400",
    description: "Tons de verde que representam natureza, saúde e frescor dos alimentos."
  },
  {
    id: "red",
    name: "Vermelho Apetite",
    colors: {
      primary: "0 84% 60%", // Red
      secondary: "0 30% 96%",
      accent: "0 40% 95%",
      background: "0 0% 100%",
    },
    preview: "bg-gradient-to-r from-red-600 to-red-400",
    description: "Tons de vermelho que estimulam o apetite e transmitem energia e paixão."
  },
  {
    id: "orange",
    name: "Laranja Alegria",
    colors: {
      primary: "25 95% 53%", // Orange
      secondary: "25 30% 96%",
      accent: "25 40% 95%",
      background: "0 0% 100%",
    },
    preview: "bg-gradient-to-r from-orange-500 to-orange-300",
    description: "Tons de laranja que transmitem alegria, diversão e entusiasmo."
  },
  {
    id: "teal",
    name: "Turquesa Refrescante",
    colors: {
      primary: "180 100% 30%", // Teal
      secondary: "180 30% 96%",
      accent: "180 40% 95%",
      background: "0 0% 100%",
    },
    preview: "bg-gradient-to-r from-teal-600 to-teal-400",
    description: "Tons de turquesa que representam frescor, limpeza e tranquilidade."
  },
  {
    id: "pink",
    name: "Rosa Doce",
    colors: {
      primary: "330 100% 70%", // Pink
      secondary: "330 30% 96%",
      accent: "330 40% 95%",
      background: "0 0% 100%",
    },
    preview: "bg-gradient-to-r from-pink-500 to-pink-300",
    description: "Tons de rosa que transmitem doçura, gentileza e energia jovial."
  },
  {
    id: "dark",
    name: "Modo Escuro",
    colors: {
      primary: "267 100% 75%", // Purple on dark
      secondary: "240 5% 20%",
      accent: "240 5% 25%",
      background: "240 10% 5%",
    },
    preview: "bg-gradient-to-r from-gray-800 to-gray-700",
    description: "Tema escuro para uso noturno, reduz o brilho da tela e descansa os olhos."
  }
];

interface ColorPaletteProps {
  onSelectTheme: (theme: ColorTheme) => void;
  selectedThemeId: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  onSelectTheme,
  selectedThemeId,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {COLOR_THEMES.map((theme) => (
        <div
          key={theme.id}
          className={cn(
            "relative rounded-lg border p-4 cursor-pointer transition-all duration-200",
            selectedThemeId === theme.id
              ? "border-primary ring-2 ring-primary/30"
              : "hover:border-primary/50"
          )}
          onClick={() => onSelectTheme(theme)}
        >
          <div className={`${theme.preview} h-20 rounded-md mb-3`}></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{theme.name}</h3>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
            </div>
            {selectedThemeId === theme.id && (
              <div className="bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorPalette;
