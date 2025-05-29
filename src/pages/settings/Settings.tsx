
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Separator } from "@/components/ui/separator";
import CompanyInformationCard from "@/components/settings/CompanyInformationCard";
import MenuPreviewCard from "@/components/settings/MenuPreviewCard";
import ThemeSettingsCard from "@/components/settings/ThemeSettingsCard";
import PrinterSettingsCard from "@/components/settings/PrinterSettingsCard";

const Settings = () => {
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
          <CompanyInformationCard />
          <MenuPreviewCard />
          <ThemeSettingsCard />
          <PrinterSettingsCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
