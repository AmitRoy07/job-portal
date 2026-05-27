"use client";

import React, { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, UserCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { loginAction } from "@/feature/auth/server/auth.action";
import { toast } from "sonner";
import { LoginUserData, LoginUserSchema } from "@/feature/auth/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
  });

  const onSubmit = async (data: LoginUserData) => {
    const response = await loginAction(data);

    if (response.status === "SUCCESS") {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Join Our Job Portal</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className={`pl-10 `}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className={`pl-10`}
                  {...register("password")}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
