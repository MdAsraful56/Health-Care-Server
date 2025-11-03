import { Prisma } from '@prisma/client';
import prisma from '../../config/db';
import { paginationHelper } from '../../helpers/paginationHelper';
import { doctorSearchableFields } from './doctor.constant';

const getAllDoctorsFromDB = async (filters: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        OR: doctorSearchableFields.map((field) => ({
            [field]: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        }));
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));

        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    return {
        meta: {
            page,
            limit,
            total: await prisma.doctor.count({ where: whereConditions }),
        },
        data: result,
    };
};

export const DoctorService = {
    getAllDoctorsFromDB,
};
