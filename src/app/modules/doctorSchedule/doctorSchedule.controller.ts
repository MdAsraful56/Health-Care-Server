import { Request, Response } from 'express';
import { IJWTPayload } from '../../types/common';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DoctorScheduleService } from './doctorSchedule.service';

const doctorScheduleCreate = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const user = req.user;

        const result = await DoctorScheduleService.createScheduleForDoctor(
            req.body,
            user as IJWTPayload
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Doctor schedule created successfully!',
            data: result,
        });
    }
);

export const DoctorScheduleController = {
    doctorScheduleCreate,
};
