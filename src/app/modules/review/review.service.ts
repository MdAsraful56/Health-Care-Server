import httpStatus from 'http-status';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { paginationHelper } from '../../helpers/paginationHelper';
import { IJWTPayload } from '../../types/common';

const createReview = async (payload: any, user: IJWTPayload) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
        },
    });

    if (patientData.id !== appointmentData.patientId) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'This is not your appointment!'
        );
    }

    if (appointmentData.status !== 'COMPLETED') {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'You can review only completed appointments!'
        );
    }

    return await prisma.$transaction(async (tnx) => {
        const result = await tnx.review.create({
            data: {
                appointmentId: appointmentData.id,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                rating: payload.rating,
                comment: payload.comment,
            },
        });

        const avgRating = await tnx.review.aggregate({
            _avg: {
                rating: true,
            },
            where: {
                doctorId: appointmentData.doctorId,
            },
        });

        await tnx.doctor.update({
            where: {
                id: appointmentData.doctorId,
            },
            data: {
                averageRating: avgRating._avg.rating as number,
            },
        });
        return result;
    });
};

const getReviewsByDoctor = async (doctorId: string, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const reviews = await prisma.review.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: {
            doctorId: doctorId,
        },
    });

    const total = await prisma.review.count({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: {
            doctorId: doctorId,
        },
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: reviews,
    };
};

const getReviews = async (options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);
    const reviews = await prisma.review.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma.review.count({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: reviews,
    };
};

export const ReviewService = {
    createReview,
    getReviewsByDoctor,
    getReviews,
};
