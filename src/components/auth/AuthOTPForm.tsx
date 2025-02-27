
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface AuthOTPFormProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
  resendTimer: number;
  setResendTimer: React.Dispatch<React.SetStateAction<number>>;
}

export const AuthOTPForm = ({ 
  email, 
  onBack, 
  onSuccess,
  resendTimer,
  setResendTimer
}: AuthOTPFormProps) => {
  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState("");
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter the verification code.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });
      
      if (error) throw error;
      
      toast({
        title: "Email verified successfully!",
        description: "You can now sign in to your account.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      setResendTimer(60);
      toast({
        title: "Verification code resent!",
        description: "Please check your email for the new verification code.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <Input
        type="text"
        placeholder="Enter verification code"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Email"
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleResendOTP}
        disabled={resendTimer > 0 || loading}
      >
        {resendTimer > 0
          ? `Resend code in ${resendTimer}s`
          : "Resend verification code"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onBack}
      >
        Back to Sign In
      </Button>
    </form>
  );
};
