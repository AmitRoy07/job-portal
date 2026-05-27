import { z } from "zod";

export const registerUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long").max(255, "Name must be at most 255 characters long"),

    userName: z.string().trim().min(2, "Username must be at least 2 characters long").max(255, "Username must be at most 255 characters long").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, and underscores"),

    email: z.email('please enter a valid email address').trim().max(255, "Email must be at most 255 characters long").toLowerCase(),

    password: z.string().trim().min(6, "Password must be at least 6 characters long").max(255, "Password must be at most 255 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

    confirmPassword: z.string(),

    role: z.enum(['applicant', 'employer'], {
        error: "Role must be either 'applicant' or 'employer'",
    }).default('applicant'),
})

// z.infer will create a TypeScript type based on the Zod schema
export type RegisterUserData =  z.infer<typeof registerUserSchema>;



// export const registerUserWithConfirmSchema = registerUserSchema.extend({
//     confirmPassword: z.string(),
// })
// .refine((data) => {
//     data.password === data.confirmPassword, {
//         message: "Passwords don't match",
//         path: ["confirmPassword"],
//     }
// })

// export type RegisterUserWithConfirmData = z.infer<typeof registerUserWithConfirmSchema>;


export const LoginUserSchema = z.object({
    email: z.email('please enter a valid email address').trim().max(255, "Email must be at most 255 characters long").toLowerCase(),
    
    password: z.string().trim().min(6, "Password must be at least 6 characters long").max(255, "Password must be at most 255 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export type LoginUserData = z.infer<typeof LoginUserSchema>;










