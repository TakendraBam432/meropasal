import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
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
      
      navigate("/");
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
                onClick={() => setShowOTP(false)}
              >
                Back to Sign In
              </Button>
            </form>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
