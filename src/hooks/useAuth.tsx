import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (type: "google" | "github") => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { display_name: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user as User);
      }
      setLoading(false);
    };

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const signIn = async (type: "google" | "github") => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: type,
        options: {
          redirectTo: `${window.location.origin}/auth-check`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Authentication error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      console.error("Sign out error:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (data: { display_name: string }) => {
    setLoading(true);
    try {
      const { data: user, error } = await supabase.auth.updateUser({
        data: {
          display_name: data.display_name,
        },
      });
      
      if (error) throw error;
      
      setUser((prevUser) => (prevUser ? { ...prevUser, display_name: data.display_name } : null));
    } catch (error: any) {
      console.error("Update profile error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextProps = { user, loading, signIn, signOut, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
