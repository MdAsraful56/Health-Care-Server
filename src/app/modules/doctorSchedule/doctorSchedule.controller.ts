import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../helpers/pick';
import { IJWTPayload } from '../../types/common';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { scheduleFilterableFields } from './doctorSchedule.constant';
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

const getMySchedule = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
        const options = pick(req.query, [
            'limit',
            'page',
            'sortBy',
            'sortOrder',
        ]);

        const user = req.user;
        const result = await DoctorScheduleService.getMySchedule(
            filters,
            options,
            user as IJWTPayload
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'My Schedule fetched successfully!',
            data: result,
        });
    }
);

const DeleteDoctorSchedule = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const user = req.user;
        const { id } = req.params;
        const result = await DoctorScheduleService.deleteDoctorSchedule(
            user as IJWTPayload,
            id
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'My Schedule deleted successfully!',
            data: result,
        });
    }
);

const GetAllDoctorSchedules = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, scheduleFilterableFields);
        const options = pick(req.query, [
            'limit',
            'page',
            'sortBy',
            'sortOrder',
        ]);
        const result = await DoctorScheduleService.getAllDoctorSchedules(
            filters,
            options
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Doctor Schedule retrieval successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

export const DoctorScheduleController = {
    doctorScheduleCreate,
    getMySchedule,
    DeleteDoctorSchedule,
    GetAllDoctorSchedules,
};
