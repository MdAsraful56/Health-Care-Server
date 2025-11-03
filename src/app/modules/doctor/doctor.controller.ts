import { Request, Response } from 'express';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { doctorFilterableFields } from './doctor.constant';
import { DoctorService } from './doctor.service';

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, doctorFilterableFields);

    const result = await DoctorService.getAllDoctorsFromDB(options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctors retrieved successfully',
        data: result,
    });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await DoctorService.updateDoctorInDB(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor updated successfully',
        data: result,
    });
});

export const DoctorController = {
    getAllDoctors,
    updateDoctor,
};
