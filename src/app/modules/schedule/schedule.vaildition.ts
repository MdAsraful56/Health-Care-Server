import z from 'zod';

const scheduleValidationSchema = z.object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
});

export const ScheduleValidation = {
    scheduleValidationSchema,
};
