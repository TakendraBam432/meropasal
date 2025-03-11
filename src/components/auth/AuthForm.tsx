
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOTP: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setResendTimer: React.Dispatch<React.SetStateAction<number>>;
}

export const AuthForm = ({ 
  isLogin, 
  setIsLogin, 
  setShowOTP, 
  setEmail, 
  email,
  setResendTimer 
}: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        if (!data.user?.email_confirmed_at) {
          setShowOTP(true);
          setLoading(false);
          toast({
            title: "Email verification required",
            description: "Please verify your email to continue.",
          });
          return;
        }
        
        // Redirect immediately after successful login
        navigate("/");
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'buyer', // Default role is buyer
            },
          },
        });
        if (error) throw error;

        if (data.user?.identities?.length === 0) {
          throw new Error("An account with this email already exists");
        }

        setShowOTP(true);
        setResendTimer(60);
        toast({
          title: "Verification code sent!",
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message.includes("invalid_credentials")) {
        errorMessage = "Invalid email or password";
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <div className="space-y-4">
        <Input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {isLogin && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigate("/reset-password")}
          >
            Forgot password?
          </Button>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isLogin ? "Signing in..." : "Creating account..."}
          </>
        ) : (
          isLogin ? "Sign in" : "Create account"
        )}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => {
          setIsLogin(!isLogin);
          setShowOTP(false);
        }}
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </form>
  );
};
