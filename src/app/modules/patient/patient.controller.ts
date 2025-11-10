import { Request, Response } from 'express';
import httpStatus from 'http-status';

import pick from '../../helpers/pick';
import { IJWTPayload } from '../../types/common';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { patientFilterableFields } from './patient.constant';
import { PatientService } from './patient.service';

const GetAllPatients = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await PatientService.getAllPatients(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

const GetPatientById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.getPatientById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient retrieval successfully',
        data: result,
    });
});

const SoftDelete = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const user = req.user;
        const result = await PatientService.softDelete(user as IJWTPayload);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Patient soft deleted successfully',
            data: result,
        });
    }
);

const UpdatePatient = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const user = req.user;
        const result = await PatientService.updatePatient(
            user as IJWTPayload,
            req.body
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Patient updated successfully',
            data: result,
        });
    }
);

export const PatientController = {
    GetAllPatients,
    GetPatientById,
    SoftDelete,
    UpdatePatient,
};
