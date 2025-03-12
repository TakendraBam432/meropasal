
import { supabase } from "@/integrations/supabase/client";

export const setAsSuperAdmin = async (userId: string) => {
  try {
    // Make sure user is also set as admin when becoming super admin
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: true, is_super_admin: true })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("Error setting user as super admin:", error.message);
    throw error;
  }
};

export const createAdmin = async (userId: string) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("Error creating admin:", error.message);
    throw error;
  }
};
