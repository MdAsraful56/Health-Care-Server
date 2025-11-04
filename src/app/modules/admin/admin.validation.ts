import z from 'zod';

const createAdminValidationSchema = z.object({
    password: z.string().nonempty('Password is required'),
    admin: z.object({
        name: z.string().nonempty('Name is required'),
        email: z.string().nonempty('Email is required'),
        contactNumber: z.string().nonempty('Contact Number is required'),
    }),
});

export const AdminValidation = {
    createAdminValidationSchema,
};
