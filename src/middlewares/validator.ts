import * as z from "zod";

export const GENDERS = ["male", "female"] as const;

const UserSchema = z.object({
  first_name: z.string("First name is required.").min(2).max(30).toLowerCase(),
  last_name: z.string("Last name is required.").min(2).max(30).toLowerCase(),
  email: z.email("Enter a valid email address").toLowerCase().trim(),
  gender: z.enum(GENDERS, "Select a valid gender").optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{6,14}$/, "Use international format, e.g. +2348012345678")
    .optional(),
  password: z.string().min(8).max(72),
  date_of_birth: z.iso
    .date("Use YYYY-MM-DD")
    .refine(
      (d) => new Date(d) <= new Date(),
      "Date of birth can't be in the future",
    )
    .optional(),
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

export type User = z.infer<typeof UserSchema>;
export type Login = z.infer<typeof LoginSchema>;

export { UserSchema, LoginSchema };
