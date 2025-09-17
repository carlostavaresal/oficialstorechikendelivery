import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BackupManager from "@/components/backup/BackupManager";
import { Separator } from "@/components/ui/separator";

const SystemBackup: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Backup do Sistema</h2>
          <p className="text-muted-foreground">
            Gerencie backups completos do sistema para segurança dos dados
          </p>
        </div>
        <Separator />
        
        <BackupManager />
      </div>
    </DashboardLayout>
  );
};

export default SystemBackup;