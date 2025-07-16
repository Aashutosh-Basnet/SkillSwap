import {z} from "zod";

export const signUpSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters"),
    
    lastName: z.string()
        .min(2, "Last name must be at least 2 characters"),
    
    email: z.string()
        .email("Invalid email format.")
        .transform((val) => val.toLowerCase().trim()),

    password: z.string()
        .min(8, "Password must be at least 8 characters."),

    confirmPassword: z.string(),
})
.superRefine((data, ctx) => {
    if (data.password != data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        })
    }
});


export const signInSchema = z.object({
    username: z.string()
        .min(1, "Username or email is required"),

    password: z
            .string()
            .min(1, "Password is required"),
});


export type TSignInSchema = z.infer<typeof signInSchema>;
export type TSignUpSchema = z.infer<typeof signUpSchema>;