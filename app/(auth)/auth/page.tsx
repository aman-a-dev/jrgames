"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Mail, User, Lock } from "lucide-react";
import { IconBrandGoogle } from "@tabler/icons-react";

import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const supabase = createClient();

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        // Redirect to dashboard if already logged in
        window.location.href = "/home";
      }
    };
    checkSession();
  }, []);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email address.");

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification email sent to your inbox!");
      setActiveTab("login");
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsLoading(true);

    // Sign up with email and password
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Account created successfully! Please check your email to verify.",
      );
      setActiveTab("login");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("Please enter your email and password.");
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in successfully!");
      // Redirect to dashboard
      window.location.href = "/home";
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex items-center flex-col min-h-screen justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-xl border-zinc-200 dark:border-zinc-800">
          <CardHeader className="text-center space-y-2 pb-4">
            <CardTitle className="text-2xl font-bold">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login"
                ? "Login to your account with your email."
                : "Create a new account with your email address."}
            </CardDescription>
          </CardHeader>

          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as any)}
            className="w-full"
          >
            <CardContent className="space-y-4 pt-0">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* LOGIN TAB */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  className="w-full"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Login to Account
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <span className="relative bg-background px-2 text-xs text-muted-foreground">
                    or continue with
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <IconBrandGoogle className="mr-2 h-4 w-4" />
                  )}
                  Sign in with Google
                </Button>
              </TabsContent>

              {/* SIGNUP TAB */}
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Abebe Kebede"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create Account
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <span className="relative bg-background px-2 text-xs text-muted-foreground">
                    or continue with
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <IconBrandGoogle className="mr-2 h-4 w-4" />
                  )}
                  Sign up with Google
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>

          <AuthFooter />
        </Card>
      </motion.div>
    </main>
  );
}

function AuthFooter() {
  return (
    <CardFooter className="flex flex-col space-y-2 pt-0">
      <p className="text-xs text-muted-foreground text-center mt-4">
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </CardFooter>
  );
}
