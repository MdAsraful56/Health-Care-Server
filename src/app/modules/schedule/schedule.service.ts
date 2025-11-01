import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../config/db';

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

export const ScheduleService = {
    createSchedule,
};
