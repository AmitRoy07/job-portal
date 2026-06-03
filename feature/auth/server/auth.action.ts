"use server";

import { db } from "@/config/db";
import { users, applicants, employers } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import {
  LoginUserData,
  LoginUserSchema,
  RegisterUserData,
  registerUserSchema,
} from "../auth.schema";
import { createSessionAndSetCookie, invalidateSession } from "./use-cases/sessions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from 'crypto';

export const registrationAction = async (data: RegisterUserData) => {
  console.log(data);

  try {
    const { data: validatedData, error } = registerUserSchema.safeParse(data);

    // console.log(validatedData);

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

    await db.transaction( async(tx) => {
      const [result] = await tx
        .insert(users)
        .values({ name, userName, email, password: hashedPassword, role });

        if (role === "applicant") {
          await tx.insert(applicants).values({id: result.insertId});
        } else {
          await tx.insert(employers).values({id: result.insertId});
        }
  
        await createSessionAndSetCookie(result.insertId, tx);
    })


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

    // await db.transaction( async(tx) => {

    //   if (user.role === "applicant") {
    //       await tx.insert(applicants).values({id: result.insertId});
    //     } else {
    //       await tx.insert(employers).values({id: result.insertId});
    //     }

    // })
    
        await createSessionAndSetCookie(user.id);

    return {
      status: "SUCCESS",
      message: "Login successful",
      role: user.role
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "unexpected error occurred",
    };
  }
};


export const LogOutUserAction = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
        return redirect('/login');
    }

    const hashToken = crypto.createHash('sha256').update(session).digest('hex');

    await invalidateSession(hashToken);
    cookieStore.delete('session');

    return redirect('/login');
}