"use server";

import { db } from "@/config/db";
import { users } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import {
  LoginUserData,
  LoginUserSchema,
  RegisterUserData,
  registerUserSchema,
} from "../auth.schema";
import { createSessionAndSetCookie } from "./use-cases/sessions";

export const registrationAction = async (data: RegisterUserData) => {
  console.log(data);

  try {
    const { data: validatedData, error } = registerUserSchema.safeParse(data);

    console.log(validatedData);

    if (error) {
      return {
        status: "ERROR",
        message: error.issues[0].message,
      };
    }

    const { name, userName, email, password, role } = validatedData;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.userName, userName)));

    if (user) {
      if (user.email === email) {
        return {
          status: "ERROR",
          message: "Email already exists",
        };
      } else {
        return {
          status: "ERROR",
          message: "Username already exists",
        };
      }
    }

    const hashedPassword = await argon2.hash(password); // Replace with actual hashing logic

    await db
      .insert(users)
      .values({ name, userName, email, password: hashedPassword, role });

    return {
      status: "SUCCESS",
      message: "Registration successful",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Registration failed",
    };
  }
};

// type LoginData = {
//   email: string;
//   password: string;
// };

export const loginAction = async (data: LoginUserData) => {
  try {
    const { data: validatedData, error } = LoginUserSchema.safeParse(data);

    if (error) {
      return {
        status: "ERROR",
        message: error.issues[0].message,
      };
    }

    const { email, password } = validatedData;

    if (!email || !password) {
      return {
        status: "ERROR",
        message: "Invalid Email or Password",
      };
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return {
        status: "ERROR",
        message: "Invalid Email or Password",
      };
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return {
        status: "ERROR",
        message: "Invalid Email or Password",
      };
    }

    await createSessionAndSetCookie(user.id);

    return {
      status: "SUCCESS",
      message: "Login successful",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "unexpected error occurred",
    };
  }
};
