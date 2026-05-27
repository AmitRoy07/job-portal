"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { registrationAction } from "@/feature/auth/server/auth.action";
// import {
//   RegisterUserWithConfirmData,
//   registerUserWithConfirmSchema,
// } from "@/feature/auth/auth.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterUserData,
  registerUserSchema,
} from "@/feature/auth/auth.schema";

import { useRouter } from "next/navigation";

// interface RegistrationFormProps {
//   name: string;
//   userName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   role: "applicant" | "employer";
// }

const RegistrationForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // const [formData, setFormData] = useState<RegistrationFormProps>({
  //   name: "",
  //   userName: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  //   role: "applicant",
  // });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      role: "applicant",
    },
  });

  // const handleInputChange = (name: string, value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const onSubmit = async (data: RegisterUserData) => {
    // const registrationData = {
    //   name: formData.name.trim(),
    //   userName: formData.userName.trim(),
    //   email: formData.email.toLocaleLowerCase().trim(),
    //   password: formData.password,
    //   role: formData.role,
    // };

    // console.log(data);
    const result = await registrationAction(data);
    // console.log(result);

    if (result.status === "SUCCESS") {
      toast.success(result.message);

      // Clear all form values
      reset();

      // Redirect to login page after successful registration
      router.push("/login");
    } else {
      toast.error(result.message);
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
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="block">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className={`pl-10 `}
                  {...register("name")}
                  // value={formData.name}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  //   handleInputChange("name", e.target.value)
                  // }
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label className="block" htmlFor="userName">
                Username *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="userName"
                  type="text"
                  {...register("userName")}
                  placeholder="Choose a username"
                  required
                  className={`pl-10`}
                  // value={formData.userName}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  //   handleInputChange("userName", e.target.value)
                  // }
                />
              </div>
              {errors.userName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label className="block" htmlFor="email">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  required
                  className={`pl-10 `}
                  // value={formData.email}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  //   handleInputChange("email", e.target.value)
                  // }
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2 w-full">
              <Label className="block" htmlFor="role">
                I am a *
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applicant">Job Applicant</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              ></Controller>
              {errors.role && (
                <p className="text-sm text-destructive mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label className="block" htmlFor="password">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  {...register("password")}
                  type={showPassword.password ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className={`pl-10 pr-10 `}
                  // value={formData.password}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  //   handleInputChange("password", e.target.value)
                  // }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      password: !showPassword.password,
                    })
                  }
                >
                  {showPassword.password ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label className="block" htmlFor="confirmPassword">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  required
                  className={`pl-10 pr-10 `}
                  // value={formData.confirmPassword}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  //   handleInputChange("confirmPassword", e.target.value)
                  // }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirmPassword: !showPassword.confirmPassword,
                    })
                  }
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full cursor-pointer">
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?
                <Link
                  href="/login"
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

export default RegistrationForm;
