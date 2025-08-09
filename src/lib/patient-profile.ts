import { supabase } from './supabaseClient';

export interface PatientProfile {
  id?: string;
  user_id: string;
  full_name: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  contact_number?: string;
  email: string;
  address?: string;
  patient_id?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  medical_history?: string;
  allergies?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getPatientProfile(userId: string): Promise<PatientProfile | null> {
  try {
    console.log('Fetching patient profile for user:', userId);
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        console.log('No patient profile found for user:', userId);
        return null;
      }
      console.error('Error fetching patient profile:', error);
      throw error;
    }
    
    console.log('Patient profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in getPatientProfile:', error);
    return null;
  }
}

export async function createPatientProfile(profile: Omit<PatientProfile, 'id' | 'created_at' | 'updated_at'>): Promise<PatientProfile> {
  try {
    console.log('Creating patient profile:', profile);
    
    const { data, error } = await supabase
      .from('patients')
      .insert(profile)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating patient profile:', error);
      throw error;
    }
    
    console.log('Patient profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createPatientProfile:', error);
    throw error;
  }
}

export async function updatePatientProfile(userId: string, profile: Partial<PatientProfile>): Promise<PatientProfile> {
  try {
    console.log('Updating patient profile for user:', userId);
    console.log('Update data:', profile);
    
    // Remove any undefined or null values from the update data
    const cleanProfile = Object.fromEntries(
      Object.entries(profile).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    console.log('Cleaned update data:', cleanProfile);
    
    const { data, error } = await supabase
      .from('patients')
      .update({ ...cleanProfile, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating patient profile:', error);
      throw error;
    }
    
    console.log('Patient profile updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updatePatientProfile:', error);
    throw error;
  }
}

export async function getOrCreatePatientProfile(userId: string, userEmail: string, userFullName?: string): Promise<PatientProfile> {
  try {
    console.log('Getting or creating patient profile for user:', userId);
    
    // Try to get existing profile
    let profile = await getPatientProfile(userId);
    
    if (!profile) {
      console.log('No existing profile found, creating new one...');
      // Create new profile if it doesn't exist
      const newProfile: Omit<PatientProfile, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        full_name: userFullName || 'Unknown',
        email: userEmail,
        patient_id: `PAT${Date.now().toString().slice(-6)}`, // Generate a simple patient ID
      };
      
      profile = await createPatientProfile(newProfile);
      console.log('New patient profile created:', profile);
    } else {
      console.log('Existing patient profile found:', profile);
    }
    
    return profile;
  } catch (error) {
    console.error('Error in getOrCreatePatientProfile:', error);
    throw error;
  }
}