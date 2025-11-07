import z from 'zod';

const createPatientValidationSchema = z.object({
    password: z.string().nonempty('Password is required'),
    patient: z.object({
        name: z.string().nonempty('Name is required'),
        email: z.string().nonempty('Email is required'),
        address: z.string().optional(),
    }),
});

const updatePatientValidationSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
});

export const UserValidation = {
    createPatientValidationSchema,
    updatePatientValidationSchema,
};
