import z from 'zod';

const specialtySchema = z.object({
    specialtyId: z.string().uuid(),
    isDeleted: z.boolean().optional(),
});

const createDoctorValidationSchema = z.object({
    password: z.string().nonempty('Password is required'),
    doctor: z.object({
        name: z.string().nonempty('Name is required'),
        email: z.string().nonempty('Email is required'),
        gender: z.string().nonempty('Gender is required'),
    }),
});

const updateDoctorValidationSchema = z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z.number().optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
    appointmentFee: z.number().optional(),
    specialties: z.array(specialtySchema).optional(),
});

export const DoctorValidation = {
    createDoctorValidationSchema,
    updateDoctorValidationSchema,
};
