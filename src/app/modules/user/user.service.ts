import bcrypt from 'bcryptjs';
import { Request } from 'express';

import { Prisma } from '@prisma/client';
import prisma from '../../config/db';
import { fileUploader } from '../../helpers/fileUploader';
import { paginationHelper } from '../../helpers/paginationHelper';
import { userSearchableFilds } from './user.constant';

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

const createDoctor = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.doctor.profilePhoto = uploadResult?.secure_url;
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
            doctor: { create: (arg0: { data: any }) => any };
        }) => {
            await tnx.user.create({
                data: {
                    email: req.body.doctor.email,
                    password: hashPassword,
                },
            });

            return await tnx.doctor.create({
                data: req.body.doctor,
            });
        }
    );

    return result;
};

const createAdmin = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.admin.profilePhoto = uploadResult?.secure_url;
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
            admin: { create: (arg0: { data: any }) => any };
        }) => {
            await tnx.user.create({
                data: {
                    email: req.body.admin.email,
                    password: hashPassword,
                },
            });

            return await tnx.admin.create({
                data: req.body.admin,
            });
        }
    );

    return result;
};

const getAllUsers = async (filters: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFilds.map((field) => ({
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

const getAllDoctors = async () => {
    const result = await prisma.doctor.findMany();
    return result;
};

const getAllPatients = async () => {
    const result = await prisma.patient.findMany();
    return result;
};

const getAllAdmins = async () => {
    const result = await prisma.admin.findMany();
    return result;
};

export const UserService = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllUsers,
    getAllDoctors,
    getAllPatients,
    getAllAdmins,
};
