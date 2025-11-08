import { Request, Response } from 'express';
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

export const ReviewController = {
    CreateReview,
};
