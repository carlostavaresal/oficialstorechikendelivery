import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    // Setup realtime subscription
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Products realtime update:', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      // Primeiro, tentar buscar do Supabase
      const { data: supabaseProducts, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products from Supabase:', error);
        // Fallback para localStorage se houver erro
        loadFromLocalStorage();
        return;
      }

      if (supabaseProducts && supabaseProducts.length > 0) {
        setProducts(supabaseProducts);
      } else {
        // Se não há produtos no Supabase, tentar migrar do localStorage
        await migrateFromLocalStorage();
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        const localProducts = JSON.parse(savedProducts);
        const formattedProducts = localProducts.map((product: any) => ({
          id: product.id,
          name: product.name || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          image_url: extractImageUrl(product.image),
          category: product.category || "Geral",
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setProducts([]);
    }
  };

  const migrateFromLocalStorage = async () => {
    try {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        const localProducts = JSON.parse(savedProducts);
        const productsToInsert = localProducts.map((product: any) => ({
          name: product.name || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          image_url: extractImageUrl(product.image),
          category: product.category || "Geral",
          is_available: true
        }));

        const { data, error } = await supabase
          .from('products')
          .insert(productsToInsert)
          .select();

        if (error) {
          console.error('Error migrating products:', error);
          loadFromLocalStorage();
        } else {
          console.log('Products migrated successfully:', data);
          setProducts(data || []);
        }
      }
    } catch (error) {
      console.error('Error in migration:', error);
      loadFromLocalStorage();
    }
  };

  const extractImageUrl = (image: any): string => {
    if (!image) return '';
    
    if (typeof image === 'string') {
      return image;
    } else if (typeof image === 'object') {
      if (image.value) {
        return image.value;
      } else if (image._type === 'String' && image.value) {
        return image.value;
      }
    }
    return '';
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};