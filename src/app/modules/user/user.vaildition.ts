import z from 'zod';

const createPatientValidationSchema = z.object({
    password: z.string().nonempty('Password is required'),
    patient: z.object({
        name: z.string().nonempty('Name is required'),
        email: z.string().nonempty('Email is required'),
        address: z.string().optional(),
    }),
});

const createDoctorValidationSchema = z.object({
    password: z.string().nonempty('Password is required'),
    doctor: z.object({
        name: z.string().nonempty('Name is required'),
        email: z.string().nonempty('Email is required'),
        gender: z.string().nonempty('Gender is required'),
    }),
});

const createAdminValidationSchema = z.object({
    password: z.string().nonempty('Password is required'),
    admin: z.object({
        name: z.string().nonempty('Name is required'),
        email: z.string().nonempty('Email is required'),
        contactNumber: z.string().nonempty('Contact Number is required'),
    }),
});

export const UserValidation = {
    createPatientValidationSchema,
    createDoctorValidationSchema,
    createAdminValidationSchema,
};
