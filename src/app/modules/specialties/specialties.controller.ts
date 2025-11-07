import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SpecialtiesService } from './specialties.service';

const CreateSpecialty = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.createSpecialty(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialties created successfully!',
        data: result,
    });
});

const GetAllSpecialties = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await SpecialtiesService.getAllSpecialties(options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialties data fetched successfully',
        data: result,
    });
});

const DeleteSpecialty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteSpecialty(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});

export const SpecialtiesController = {
    CreateSpecialty,
    GetAllSpecialties,
    DeleteSpecialty,
};
