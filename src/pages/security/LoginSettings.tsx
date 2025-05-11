
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, Key, Eye, EyeOff } from "lucide-react";

const LoginSettings: React.FC = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeUsername = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        title: "Erro",
        description: "Digite sua senha atual para confirmar a mudança.",
        variant: "destructive",
      });
      return;
    }

    if (!newUsername) {
      toast({
        title: "Erro",
        description: "O novo nome de usuário não pode ser vazio.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulating API request
    setTimeout(() => {
      // Validate current password (in a real app this would be done on the server)
      if (currentPassword === "admin123") {
        // Update username in localStorage for demo purposes
        localStorage.setItem("deliveryUsername", newUsername);
        
        toast({
          title: "Nome de usuário atualizado",
          description: "Seu nome de usuário foi alterado com sucesso.",
        });
        
        setCurrentPassword("");
        setNewUsername("");
      } else {
        toast({
          title: "Erro",
          description: "Senha atual incorreta.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        title: "Erro",
        description: "Digite sua senha atual para confirmar a mudança.",
        variant: "destructive",
      });
      return;
    }

    if (!newPassword) {
      toast({
        title: "Erro",
        description: "A nova senha não pode ser vazia.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulating API request
    setTimeout(() => {
      // Validate current password (in a real app this would be done on the server)
      if (currentPassword === "admin123") {
        // Update password in AuthContext for demo purposes
        localStorage.setItem("deliveryPassword", newPassword);
        
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi alterada com sucesso.",
        });
        
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "Erro",
          description: "Senha atual incorreta.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  // Update AuthContext to use the new credentials
  React.useEffect(() => {
    const updateAuthContext = () => {
      // This would be handled by the AuthContext in a real app
      // For now we just make sure the localStorage values are being used
    };
    
    updateAuthContext();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Configurações de Login</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change Username */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" /> Alterar Nome de Usuário
              </CardTitle>
              <CardDescription>
                Atualize seu nome de usuário para acessar o painel administrativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangeUsername} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password-for-username">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="current-password-for-username"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-username">Novo Nome de Usuário</Label>
                  <Input
                    id="new-username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Digite o novo nome de usuário"
                  />
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Alterando..." : "Alterar Nome de Usuário"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Alterar Senha
              </CardTitle>
              <CardDescription>
                Atualize sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite a nova senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme a nova senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Alterando..." : "Alterar Senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Current Login Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Atuais de Login</CardTitle>
            <CardDescription>
              Credenciais utilizadas para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                  <p className="text-sm font-medium text-muted-foreground">Nome de Usuário</p>
                  <p className="font-medium">admin</p>
                </div>
                <div className="border p-4 rounded-md">
                  <p className="text-sm font-medium text-muted-foreground">Senha</p>
                  <p className="font-medium">••••••••</p>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <p className="text-amber-800 text-sm">
                  <strong>Nota:</strong> Por razões de segurança, sua senha nunca é exibida. Se você esquecer sua senha, você precisará redefiní-la.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LoginSettings;
