import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Profile } from '@/types/database';

export function useProfile() {
  const { user } = useAuth();
  return useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!isSupabaseConfigured || !user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) return null;
      return data as Profile;
    },
    enabled: !!user && isSupabaseConfigured,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}
