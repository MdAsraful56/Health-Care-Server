import { Request, Response } from 'express';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { doctorFilterableFields } from './doctor.constant';
import { DoctorService } from './doctor.service';

// Create Doctor Controller
const CreateDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Doctor created successfully!',
        data: result,
    });
});

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, doctorFilterableFields);

    const result = await DoctorService.getAllDoctors(options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctors retrieved successfully',
        data: result,
    });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await DoctorService.updateDoctor(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor updated successfully',
        data: result,
    });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.getSingleDoctor(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor retrieved successfully',
        data: result,
    });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.deleteDoctor(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor deleted successfully',
        data: result,
    });
});

const getAISuggestion = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.getAISuggestion(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'AI suggestion retrieved successfully',
        data: result,
    });
});

export const DoctorController = {
    CreateDoctor,
    getAllDoctors,
    updateDoctor,
    getSingleDoctor,
    deleteDoctor,
    getAISuggestion,
};
