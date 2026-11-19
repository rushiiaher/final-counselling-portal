import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/* Student sign-up (one form: account + profile + consent) */
export const JK_DISTRICTS = [
  "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam",
  "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur", "Other",
] as const;
export const STUDY_LEVELS = [
  "Class 8 or below", "Class 9-10", "Class 11-12", "Diploma / ITI", "Undergraduate", "Postgraduate", "Not studying / Job seeker",
] as const;

export const studentSignupSchema = z.object({
  name: z.string().trim().min(3, "Please enter your full name").max(80, "Name is too long")
    .regex(/^[\p{L} .'-]+$/u, "Name can only contain letters and spaces"),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  ageRange: z.enum(["13-17", "18-24", "25+"], { errorMap: () => ({ message: "Please select your age group" }) }),
  gender: z.enum(["MALE", "FEMALE", "PREFER_NOT_TO_SAY"], { errorMap: () => ({ message: "Please select your gender" }) }),
  grade: z.enum(STUDY_LEVELS, { errorMap: () => ({ message: "Please select what you are studying" }) }),
  school: z.string().trim().max(120, "Name is too long").optional(),
  district: z.enum(JK_DISTRICTS, { errorMap: () => ({ message: "Please select your district" }) }),
  preferredLanguage: z.enum(["en", "ur"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Please accept the Terms and Privacy Policy" }) }),
  acceptNotEmergency: z.literal(true, { errorMap: () => ({ message: "Please confirm you have read this" }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type StudentSignupInput = z.infer<typeof studentSignupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
