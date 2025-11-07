import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

// Create Admin Controller
const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Admin created successfully!',
        data: result,
    });
});

// Get All Admins Controller
const GetAllAdmins = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, ['searchTerm', 'status', 'role', 'email']);

    const result = await AdminService.getAllAdmins(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admins retrieved successfully!',
        data: result,
    });
});

const GetSingleAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const result = await AdminService.getSingleAdmin(adminId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin retrieved successfully!',
        data: result,
    });
});

const UpdateAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const result = await AdminService.updateAdmin(adminId as string, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin updated successfully!',
        data: result,
    });
});

const DeleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const result = await AdminService.deleteAdmin(adminId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin deleted successfully!',
        data: result,
    });
});

export const AdminController = {
    createAdmin,
    GetAllAdmins,
    UpdateAdmin,
    GetSingleAdmin,
    DeleteAdmin,
};
