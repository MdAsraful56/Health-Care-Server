import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../helpers/pick';
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

const PatientPrescription = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const user = req.user;
        const options = pick(req.query, [
            'limit',
            'page',
            'sortBy',
            'sortOrder',
        ]);
        const result = await PrescriptionService.patientPrescription(
            user as IJWTPayload,
            options
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Prescription fetched successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

export const PrescriptionController = {
    CreatePrescription,
    PatientPrescription,
};
