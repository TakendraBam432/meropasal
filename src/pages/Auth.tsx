
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthOTPForm } from "@/components/auth/AuthOTPForm";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        navigate("/");
      }
    };
    checkUser();

    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");
    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error_description || "An error occurred during authentication",
      });
    }
  }, [navigate, searchParams, toast]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {showOTP ? "Verify your email" : (isLogin ? "Sign in to your account" : "Create your account")}
          </CardTitle>
          {showOTP && (
            <CardDescription className="text-center">
              Enter the verification code sent to {email}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {showOTP ? (
            <AuthOTPForm 
              email={email}
              onBack={() => setShowOTP(false)}
              onSuccess={() => navigate("/")}
              resendTimer={resendTimer}
              setResendTimer={setResendTimer}
            />
          ) : (
            <AuthForm 
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              setShowOTP={setShowOTP}
              email={email}
              setEmail={setEmail}
              setResendTimer={setResendTimer}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
