import { Prisma } from '@prisma/client';
import prisma from '../../config/db';
import { paginationHelper } from '../../helpers/paginationHelper';
import { doctorSearchableFields } from './doctor.constant';
import { IDoctorUpdateInput } from './doctor.interface';

const getAllDoctorsFromDB = async (filters: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
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

const updateDoctorInDB = async (
    id: string,
    payload: Partial<IDoctorUpdateInput>
) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: { id },
    });

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter(
                (specialty) => specialty.isDeleted
            );

            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId,
                    },
                });
            }

            const createSpecialtyIds = specialties.filter(
                (specialty) => !specialty.isDeleted
            );

            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId,
                    },
                });
            }
        }

        const updatedDoctor = await tnx.doctor.update({
            where: {
                id: doctorInfo.id,
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true,
                    },
                },
            },
        });

        return updatedDoctor;
    });
};

export const DoctorService = {
    getAllDoctorsFromDB,
    updateDoctorInDB,
};
