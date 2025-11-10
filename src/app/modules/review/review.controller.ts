import { Request, Response } from 'express';
import pick from '../../helpers/pick';
import { IJWTPayload } from '../../types/common';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const CreateReview = catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
        const user = req.user;

        const result = await ReviewService.createReview(
            req.body,
            user as IJWTPayload
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Review created successfully',
            data: result,
        });
    }
);

const GetReviewsByDoctor = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.doctorId;
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await ReviewService.getReviewsByDoctor(doctorId, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews fetched successfully',
        data: result,
    });
});

const GetReviews = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await ReviewService.getReviews(options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews fetched successfully',
        data: result,
    });
});

export const ReviewController = {
    CreateReview,
    GetReviewsByDoctor,
    GetReviews,
};
