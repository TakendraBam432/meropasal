
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  is_admin: boolean;
  is_super_admin?: boolean;
  full_name?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setAsSuperAdmin: (userId: string) => Promise<void>;
  createAdmin: (userId: string) => Promise<void>;
}
