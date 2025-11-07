import { Request, Response } from 'express';
import { IJWTPayload } from '../../types/common';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PrescriptionService } from './prescription.service';

const CreatePrescription = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const user = req.user;
        const result = await PrescriptionService.createPrescription(
            user as IJWTPayload,
            req.body
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'prescription created successfully!',
            data: result,
        });
    }
);

export const PrescriptionController = {
    CreatePrescription,
};
