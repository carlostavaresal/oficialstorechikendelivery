
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanySettings } from '@/types/database';

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
          .insert([newSettings as any]);

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
