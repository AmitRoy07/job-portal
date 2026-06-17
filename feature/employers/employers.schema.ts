import { z } from "zod";

export const organizationTypes = [
    "development",
    "design",
    "marketing",
    "sales",
    "finance",
    "healthcare",
    "education",
    "non_profit",
    'business',
    "government",
    "other"
] as const;


export const teamSizes = [
  "just me",
  "2-10 employees",
  "11-50 employees",
  "51-200 employees",
  "200+ employees",
] as const;

export const employerProfileSchema = z.object({
    name: z.string()
    .trim().min(2, "Name must be at least 2 characters long")
    .max(255, "Name must be at most 255 characters long"),

    description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters long")
    .max(255, "Description must be at most 255 characters long"),

    organizationType: z.enum(organizationTypes, {
        message: "Organization type must be one of the predefined options",
    }),

    teamSize: z.enum(teamSizes, {
        message: "Team size must be one of the predefined options",
    }),

    yearOffStablishment: z.string().trim()
    .regex(/^\d{4}$/, "Year of establishment must be a valid year in YYYY format")
    .refine((value) => {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return year >= 1800 && year <= currentYear;
    }, {
        message: "Year of establishment must be between 1800 and the current year",
    }),

    websiteUrl: z.string()
    .trim()
    .url("Please enter a valid URL (eg: https://www.example.com)")
    .max(255, "Website URL must be at most 255 characters long")
    .or(z.literal(''))
    .optional(),

    location: z.string()
    .trim()
    .min(2, "Location must be at least 2 characters long")
    .max(255, "Location must be at most 255 characters long")
    .or(z.literal(''))
    .optional(),

});

export type EmployerProfileData = z.infer<typeof employerProfileSchema>;
