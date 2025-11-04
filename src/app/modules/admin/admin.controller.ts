import { Request, Response } from 'express';
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

export const AdminController = {
    createAdmin,
};
