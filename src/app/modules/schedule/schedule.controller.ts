import { Request, Response } from 'express';
import pick from '../../helpers/pick';
import { IJWTPayload } from '../../types/common';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ScheduleService } from './schedule.service';

const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.createSchedule(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Schedule created successfully!',
        data: result,
    });
});

const schedulesForDoctor = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const options = pick(req.query, [
            'page',
            'limit',
            'sortBy',
            'sortOrder',
        ]);
        const filters = pick(req.query, ['startDateTime', 'endDateTime']);

        const user = req.user;
        const result = await ScheduleService.schedulesForDoctor(
            filters,
            options,
            user as IJWTPayload
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Schedule fetched successfully!',
            meta: result.meta,
            data: result.data,
        });
    }
);

export const ScheduleController = {
    createSchedule,
    schedulesForDoctor,
};
