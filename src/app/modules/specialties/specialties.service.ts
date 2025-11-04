import { Specialties } from '@prisma/client';
import { Request } from 'express';
import httpStatus from 'http-status';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { fileUploader } from '../../helpers/fileUploader';
import { paginationHelper } from '../../helpers/paginationHelper';

const createSpecialty = async (req: Request) => {
    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }

    const specialtyExists = await prisma.specialties.findFirst({
        where: {
            title: {
                equals: req.body.title,
                mode: 'insensitive',
            },
        },
    });

    if (specialtyExists) {
        throw new ApiError(httpStatus.CONFLICT, 'Specialty already exists');
    }

    const result = await prisma.specialties.create({
        data: req.body,
    });

    return result;
};

const getAllSpecialties = async (
    options: any
): Promise<{
    meta: { total: number; page: number; limit: number };
    data: Specialties[];
}> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const data = await prisma.specialties.findMany({
        skip: skip,
        take: limit,
    });

    const total = (await prisma.specialties.count()) || 0;

    return {
        meta: {
            total,
            page,
            limit,
        },
        data,
    };
};

const deleteSpecialty = async (id: string): Promise<Specialties> => {
    const result = await prisma.specialties.delete({
        where: {
            id,
        },
    });
    return result;
};

export const SpecialtiesService = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
};
