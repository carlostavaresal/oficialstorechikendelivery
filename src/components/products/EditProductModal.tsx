
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImage, UploadCloud } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Product } from "./ProductsList";

// Define the form schema with validation
const editProductSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  price: z.coerce.number().positive("Preço deve ser um valor positivo"),
  description: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  category: z.string().min(2, "Categoria deve ter pelo menos 2 caracteres"),
});

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ open, onOpenChange, product }) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = React.useState<string>(product.image);
  const imageRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    },
  });

  // Update form values when product changes
  React.useEffect(() => {
    form.reset({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
    setImagePreview(product.image);
  }, [product, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter menos de 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Formato inválido",
          description: "Por favor, envie apenas arquivos de imagem.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof editProductSchema>) => {
    // Get current products from localStorage
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      
      // Find and update the product
      const updatedProducts = products.map((p: Product) => {
        if (p.id === product.id) {
          return {
            ...p,
            name: values.name,
            price: values.price,
            description: values.description,
            category: values.category,
            image: imagePreview,
          };
        }
        return p;
      });
      
      // Save back to localStorage
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      
      // Dispatch an event to notify that products have been updated
      window.dispatchEvent(new Event("productsUpdated"));
      
      // Close modal
      onOpenChange(false);
      
      toast({
        title: "Produto atualizado",
        description: `${values.name} foi atualizado com sucesso.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Imagem do Produto</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-32 w-32 items-center justify-center rounded-md border border-dashed">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center">
                      <FileImage className="h-10 w-10 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">
                        Nenhuma imagem<br />selecionada
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-product-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent">
                      <UploadCloud className="h-4 w-4" />
                      <span>Trocar imagem</span>
                    </div>
                    <Input
                      id="edit-product-image"
                      ref={imageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG ou PNG, máximo de 5MB.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
