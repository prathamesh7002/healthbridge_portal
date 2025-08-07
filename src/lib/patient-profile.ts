import { supabase } from './supabaseClient';

export async function getPatientProfile(userId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updatePatientProfile(userId: string, profile: any) {
  const { data, error } = await supabase
    .from('patients')
    .update(profile)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}