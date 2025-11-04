import { v4 as uuidv4 } from 'uuid';
import prisma from '../../config/db';
import { IJWTPayload } from '../../types/common';

const createAppointment = async (
    payload: { doctorId: string; scheduleId: string },
    user: IJWTPayload
) => {
    const pasientDate = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false,
        },
    });

    const isBooked = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false,
        },
    });
    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (tnx: any) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                doctorId: doctorData.id,
                patientId: pasientDate.id,
                scheduleId: payload.scheduleId,
                videoCallingId: videoCallingId,
            },
        });

        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId,
                },
            },
            data: {
                isBooked: true,
            },
        });

        const transactionId = uuidv4();

        await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
            },
        });

        return appointmentData;
    });
    return result;
};

export const AppointmentService = {
    // Define service methods for managing appointments here
    createAppointment,
};
