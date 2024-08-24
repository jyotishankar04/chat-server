import z from "zod";

export const authSignUpValidator = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter your email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const authLoginValidator = z.object({
  email: z.string().email({ message: "Email must required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
