import { Request, Response } from 'express';
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

// Create Doctor Controller
const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Doctor created successfully!',
        data: result,
    });
});

// Create Admin Controller
const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Admin created successfully!',
        data: result,
    });
});

// Get All Users Controller
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, ['searchTerm', 'status', 'role']);

    const result = await UserService.getAllUsers(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully!',
        data: result,
    });
});

// Get All Doctors Controller
const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllDoctors();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctors retrieved successfully!',
        data: result,
    });
});

// Get All Patients Controller
const getAllPatients = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllPatients();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patients retrieved successfully!',
        data: result,
    });
});

// Get All Admins Controller
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllAdmins();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admins retrieved successfully!',
        data: result,
    });
});

export const UserController = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllUsers,
    getAllDoctors,
    getAllPatients,
    getAllAdmins,
};
