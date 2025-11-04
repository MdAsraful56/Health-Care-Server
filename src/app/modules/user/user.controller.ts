import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

// Create Patient Controller
const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Patient created successfully!',
        data: result,
    });
});

// Get All Patients Controller
const getAllPatients = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, ['searchTerm', 'status', 'role', 'email']);
    const result = await UserService.getAllPatients(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patients retrieved successfully!',
        data: result,
    });
});

const UpdatePatient = catchAsync(async (req: Request, res: Response) => {
    const patientId = req.params.id;
    const result = await UserService.updatePatient(
        patientId as string,
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient updated successfully!',
        data: result,
    });
});

const DeletePatient = catchAsync(async (req: Request, res: Response) => {
    const patientId = req.params.id;
    const result = await UserService.deletePatient(patientId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient deleted successfully!',
        data: result,
    });
});

// Get All Users Controller
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, ['searchTerm', 'status', 'role', 'email']);

    const result = await UserService.getAllUsers(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const UserController = {
    createPatient,
    getAllPatients,
    UpdatePatient,
    DeletePatient,
    getAllUsers,
};
