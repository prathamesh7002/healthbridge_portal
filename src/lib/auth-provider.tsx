"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any;
  session: any;
  userRole: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
          } else {
            // Try to get role from user metadata
            const role = initialSession.user.user_metadata?.role;
            if (role && ['patient', 'doctor', 'admin'].includes(role)) {
              setUserRole(role);
              localStorage.setItem('userRole', role);
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
          } else {
            // Try to get role from user metadata
            const role = session.user.user_metadata?.role;
            if (role && ['patient', 'doctor', 'admin'].includes(role)) {
              setUserRole(role);
              localStorage.setItem('userRole', role);
            }
          }
        } else {
          // User is signed out
          setUserRole(null);
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
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserRole(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
    } catch (error) {
      console.error('Error signing out:', error);
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
      loading, 
      signOut, 
      refreshUser, 
      setUserRole: handleSetUserRole 
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