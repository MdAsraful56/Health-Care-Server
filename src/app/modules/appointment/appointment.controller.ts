import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IJWTPayload } from '../../types/common';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppointmentService } from './appointment.service';

const CreateAppointment = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const user = req.user;

        const result = await AppointmentService.createAppointment(
            req.body,
            user as IJWTPayload
        );

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Appointment created successfully',
            data: result,
        });
    }
);

export const AppointmentController = {
    CreateAppointment,
};
