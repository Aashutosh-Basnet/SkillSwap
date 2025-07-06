import {z} from "zod";

export const signUpSchema = z.object({
    email: z.string()
        .email("Invalid email format.")
        .transform((val) => val.toLowerCase().trim()),

    password: z.string()
        .min(10, "password must be atleast 10 characters."),

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
    email: z.string()
        .email()
        .transform((val) => val.toLowerCase().trim()),

    password: z
            .string()
            .min(10, "password must be atleast 10 characters."),
});


export type TSignInSchema = z.infer<typeof signInSchema>;
export type TSignUpSchema = z.infer<typeof signUpSchema>;