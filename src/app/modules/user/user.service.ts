import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request } from 'express';
import prisma from '../../config/db';
import { fileUploader } from '../../helpers/fileUploader';
import { paginationHelper } from '../../helpers/paginationHelper';
import { patientSearchableFields, userSearchableFields } from './user.constant';

// Create a new patient
const createPatient = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.patient.profilePhoto = uploadResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(
        req.body.password,
        process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10
    );

    const result = await prisma.$transaction(
        async (tnx: {
            user: {
                create: (arg0: {
                    data: { email: string; password: string };
                }) => any;
            };
            patient: { create: (arg0: { data: any }) => any };
        }) => {
            await tnx.user.create({
                data: {
                    email: req.body.patient.email,
                    password: hashPassword,
                },
            });

            return await tnx.patient.create({
                data: req.body.patient,
            });
        }
    );

    return result;
};

const getAllPatients = async (filters: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.PatientWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.PatientWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.patient.findMany({
        skip,
        take: limit,
        where: { ...whereConditions, isDeleted: false },
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.patient.count({
        where: { ...whereConditions, isDeleted: false },
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getSinglePatient = async (patientId: string) => {
    const result = await prisma.patient.findUnique({
        where: { id: patientId },
    });
    return result;
};

const updatePatient = async (patientId: string, payload: any) => {
    const result = await prisma.patient.update({
        where: { id: patientId },
        data: payload,
    });
    return result;
};

const deletePatient = async (patientId: string) => {
    const result = await prisma.patient.update({
        where: { id: patientId },
        data: { isDeleted: true },
    });
    return result;
};

// get All users details
const getAllUsers = async (filters: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.user.count({ where: whereConditions });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

export const UserService = {
    createPatient,
    getAllPatients,
    getSinglePatient,
    updatePatient,
    deletePatient,
    getAllUsers,
};
