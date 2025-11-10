import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';

const router = express.Router();

router.post(
    '/add-review',
    auth(UserRole.PATIENT),
    ReviewController.CreateReview
);

router.get(
    '/get-reviews-by-doctor/:doctorId',
    ReviewController.GetReviewsByDoctor
);

router.get('/all-reviews', ReviewController.GetReviews);

export const ReviewRoutes = router;
