
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CompanySettings {
  id: string;
  whatsapp_number: string;
  company_name?: string | null;
  company_address?: string | null;
  delivery_fee?: number | null;
  minimum_order?: number | null;
  created_at: string;
  updated_at: string;
}

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching company settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    try {
      if (settings) {
        const { error } = await supabase
          .from('company_settings')
          .update(newSettings)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('company_settings')
          .insert([newSettings]);

        if (error) throw error;
      }

      await fetchSettings();
      return true;
    } catch (error) {
      console.error('Error updating company settings:', error);
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};
