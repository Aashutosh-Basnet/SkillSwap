import {z} from "zod";

export const signUpSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters"),
    
    lastName: z.string()
        .min(2, "Last name must be at least 2 characters"),
    
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    
    email: z.string()
        .email("Invalid email format.")
        .transform((val) => val.toLowerCase().trim()),

    password: z.string()
        .min(8, "Password must be at least 8 characters."),

    confirmPassword: z.string(),
    
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
        errorMap: () => ({ message: "Please select a gender" }),
    }).optional(),
    
    phone: z.string()
        .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
        .optional()
        .or(z.literal("")),

    about: z.string()
        .max(500, "About section must be less than 500 characters")
        .optional(),
    
    learning_skills: z.array(z.string().min(1, "Skill cannot be empty"))
        .min(1, "Please add at least one skill you want to learn"),
    
    teaching_skills: z.array(z.string().min(1, "Skill cannot be empty"))
        .min(1, "Please add at least one skill you can teach"),
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


export const profileUpdateSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters"),
    
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
        errorMap: () => ({ message: "Please select a gender" }),
    }).optional(),

    avatar: z.string().nullable().optional(),

    about: z.string()
        .max(500, "About section must be less than 500 characters")
        .optional(),
    
    learning_skills: z.array(z.string().min(1, "Skill cannot be empty"))
        .min(1, "Please add at least one skill you want to learn")
        .optional(),
    
    teaching_skills: z.array(z.string().min(1, "Skill cannot be empty"))
        .min(1, "Please add at least one skill you can teach")
        .optional(),
});

export type TProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
export type TSignInSchema = z.infer<typeof signInSchema>;
export type TSignUpSchema = z.infer<typeof signUpSchema>;