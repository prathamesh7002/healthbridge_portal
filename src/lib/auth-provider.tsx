"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getOrCreatePatientProfile, PatientProfile } from "@/lib/patient-profile";

interface AuthContextType {
  user: any;
  session: any;
  userRole: string | null;
  patientProfile: PatientProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserRole: (role: string) => void;
  refreshPatientProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to handle patient profile creation/fetching
  const handlePatientProfile = async (userId: string, userEmail: string) => {
    try {
      const userFullName = user?.user_metadata?.fullName || user?.user_metadata?.name;
      const profile = await getOrCreatePatientProfile(userId, userEmail, userFullName);
      setPatientProfile(profile);
      console.log('Patient profile loaded/created:', profile);
    } catch (error) {
      console.error('Error handling patient profile:', error);
      setPatientProfile(null);
    }
  };

  // Function to refresh patient profile
  const refreshPatientProfile = async () => {
    if (user && userRole === 'patient' && user.email) {
      await handlePatientProfile(user.id, user.email);
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // Get user role from localStorage if user is authenticated
        if (initialSession?.user) {
          const storedRole = localStorage.getItem('userRole');
          if (storedRole && ['patient', 'doctor', 'admin'].includes(storedRole)) {
            setUserRole(storedRole);
            
            // Handle patient profile if user is a patient
            if (storedRole === 'patient' && initialSession.user.email) {
              await handlePatientProfile(initialSession.user.id, initialSession.user.email);
            }
          } else {
            // Try to get role from user metadata
            const role = initialSession.user.user_metadata?.role;
            if (role && ['patient', 'doctor', 'admin'].includes(role)) {
              setUserRole(role);
              localStorage.setItem('userRole', role);
              
              // Handle patient profile if user is a patient
              if (role === 'patient' && initialSession.user.email) {
                await handlePatientProfile(initialSession.user.id, initialSession.user.email);
              }
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // User is signed in
          const storedRole = localStorage.getItem('userRole');
          if (storedRole && ['patient', 'doctor', 'admin'].includes(storedRole)) {
            setUserRole(storedRole);
            
            // Handle patient profile if user is a patient
            if (storedRole === 'patient' && session.user.email) {
              await handlePatientProfile(session.user.id, session.user.email);
            }
          } else {
            // Try to get role from user metadata
            const role = session.user.user_metadata?.role;
            if (role && ['patient', 'doctor', 'admin'].includes(role)) {
              setUserRole(role);
              localStorage.setItem('userRole', role);
              
              // Handle patient profile if user is a patient
              if (role === 'patient' && session.user.email) {
                await handlePatientProfile(session.user.id, session.user.email);
              }
            }
          }
        } else {
          // User is signed out
          setUserRole(null);
          setPatientProfile(null);
          localStorage.removeItem('userRole');
          localStorage.removeItem('userEmail');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign out
  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear local state first
      setUser(null);
      setSession(null);
      setUserRole(null);
      setPatientProfile(null);
      
      // Clear localStorage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
        throw error;
      }
      
      console.log('Sign out completed successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, clear the local state
      setUser(null);
      setSession(null);
      setUserRole(null);
      setPatientProfile(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      throw error;
    }
  };

  // Refresh user (e.g., after profile update)
  const refreshUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error refreshing user:', error);
        return;
      }
      setUser(data.user ?? null);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  // Set user role
  const handleSetUserRole = (role: string) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userRole, 
      patientProfile,
      loading, 
      signOut, 
      refreshUser, 
      setUserRole: handleSetUserRole,
      refreshPatientProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}