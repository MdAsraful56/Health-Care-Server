import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    const { accessToken, refreshToken, needPasswordChange } = result;

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User logged in successfully!',
        data: { needPasswordChange },
    });
});

export const AuthController = {
    login,
};
