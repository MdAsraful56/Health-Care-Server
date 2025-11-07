import { Prisma, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request } from 'express';
import config from '../../config';
import prisma from '../../config/db';
import { fileUploader } from '../../helpers/fileUploader';
import { paginationHelper } from '../../helpers/paginationHelper';
import { adminSearchableFields } from './admin.constant';
import { createAdminInput } from './admin.interface';

// create admin service
const createAdmin = async (
    req: Request & {
        file?: Express.Multer.File;
        body: { admin: createAdminInput; password: string };
    }
) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.admin.profilePhoto = uploadResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(
        req.body.password,
        config.salt_rounds ? parseInt(config.salt_rounds) : 10
    );

    const result = await prisma.$transaction(
        async (tnx: {
            user: {
                create: (arg0: {
                    data: {
                        email: string;
                        password: string;
                        role: UserRole;
                    };
                }) => any;
            };
            admin: { create: (arg0: { data: any }) => any };
        }) => {
            await tnx.user.create({
                data: {
                    email: req.body.admin.email,
                    password: hashPassword,
                    role: UserRole.ADMIN,
                },
            });

            return await tnx.admin.create({
                data: req.body.admin,
            });
        }
    );

    return result;
};

// Get All Admins Service
const getAllAdmins = async (filters: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.AdminWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: adminSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.AdminWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.admin.findMany({
        skip,
        take: limit,
        where: { ...whereConditions, isDeleted: false },
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.admin.count({
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

const getSingleAdmin = async (adminId: string) => {
    const result = await prisma.admin.findUnique({
        where: {
            id: adminId,
            isDeleted: false,
        },
    });
    return result;
};

const updateAdmin = async (adminId: string, payload: any) => {
    const result = await prisma.admin.update({
        where: { id: adminId, isDeleted: false },
        data: payload,
    });
    return result;
};

const deleteAdmin = async (adminId: string) => {
    const result = await prisma.admin.update({
        where: {
            id: adminId,
            isDeleted: false,
        },
        data: { isDeleted: true },
    });
    return result;
};

export const AdminService = {
    createAdmin,
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
};
