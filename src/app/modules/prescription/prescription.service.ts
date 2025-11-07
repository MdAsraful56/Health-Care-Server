import {
    AppointmentStatus,
    PaymentStatus,
    Prescription,
    UserRole,
} from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { IJWTPayload } from '../../types/common';

const createPrescription = async (
    user: IJWTPayload,
    payload: Partial<Prescription>
) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID,
        },
        include: {
            doctor: true,
        },
    });

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email))
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'This is not your appointment'
            );
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null,
            updatedAt: new Date(),
        },
        include: {
            patient: true,
        },
    });

    return result;
};

// get my prescription as a patient

export const PrescriptionService = {
    createPrescription,
};
