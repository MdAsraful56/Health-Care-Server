import { Prisma } from '@prisma/client';
import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../config/db';
import { paginationHelper } from '../../helpers/paginationHelper';
import { IJWTPayload } from '../../types/common';

const createSchedule = async (payload: any) => {
    const { startTime, endTime, startDate, endDate } = payload;

    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    // console.log(currentDate, lastDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0]) // 11:00
                ),
                Number(startTime.split(':')[1])
            )
        );
        // console.log(startDateTime);

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0]) // 11:00
                ),
                Number(endTime.split(':')[1])
            )
        );

        // console.log(endDateTime);

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; // 10:30
            const slotEndDateTime = addMinutes(startDateTime, intervalTime); // 11:00

            // console.log(slotStartDateTime, slotEndDateTime);

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime,
            };
            // console.log(scheduleData);

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData,
            });
            if (existingSchedule) {
                throw new Error(
                    'Schedule already exists for the given time slot.'
                );
            }

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData,
                });
                schedules.push(result);
            }
            slotStartDateTime.setMinutes(
                slotStartDateTime.getMinutes() + intervalTime
            );
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    // console.log(schedules);

    return schedules;
};

const schedulesForDoctor = async (
    options: any,
    filters: any,
    user: IJWTPayload
) => {
    console.log(options, filters);

    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const { startDateTime: filerStartDateTime, endDateTime: filerEndDateTime } =
        filters;

    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (filerStartDateTime && filerEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filerStartDateTime,
                    },
                },
                {
                    endDateTime: {
                        lte: filerEndDateTime,
                    },
                },
            ],
        });
    }

    const whereConditions: Prisma.ScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.schedule.findMany({
        skip,
        take: limit,
        where: whereConditions,
    });

    const total = await prisma.schedule.count({ where: whereConditions });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const deleteSchedule = async (scheduleId: string) => {
    const result = await prisma.schedule.delete({
        where: {
            id: scheduleId,
        },
    });

    return result;
};

export const ScheduleService = {
    createSchedule,
    schedulesForDoctor,
    deleteSchedule,
};
