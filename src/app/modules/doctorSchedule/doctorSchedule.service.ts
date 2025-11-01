import prisma from '../../config/db';
import { IJWTPayload } from '../../types/common';

const createScheduleForDoctor = async (
    payload: {
        scheduleIds: string[];
    },
    user: IJWTPayload
) => {
    // console.log(payload);
    // console.log(user);

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user.email,
        },
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => {
        return {
            doctorId: doctorData.id,
            scheduleId: scheduleId,
        };
    });

    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData,
    });

    return result;
};

export const DoctorScheduleService = {
    createScheduleForDoctor,
};
