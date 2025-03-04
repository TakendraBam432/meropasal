
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { ToastOptions } from "@/components/ui/use-toast";

export const setUserAsSuperAdmin = async (
  userId: string,
  profile: UserProfile | null,
  toast: (options: ToastOptions) => void
) => {
  if (!profile?.is_admin) {
    toast({
      variant: "destructive",
      title: "Permission denied",
      description: "Only admin users can perform this action",
    });
    return;
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true, is_super_admin: true })
      .eq('id', userId);

    if (error) throw error;

    toast({
      title: "Success",
      description: "User has been set as a super admin",
    });
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error updating user",
      description: error.message,
    });
  }
};

export const createUserAsAdmin = async (
  userId: string,
  profile: UserProfile | null,
  toast: (options: ToastOptions) => void
) => {
  // Only super admins can create other admins
  if (!profile?.is_super_admin) {
    toast({
      variant: "destructive",
      title: "Permission denied",
      description: "Only super admin users can create other admins",
    });
    return;
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);

    if (error) throw error;

    toast({
      title: "Success",
      description: "User has been set as an admin",
    });
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error updating user",
      description: error.message,
    });
  }
};
