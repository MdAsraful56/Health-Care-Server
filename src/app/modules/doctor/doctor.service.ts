import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { extractJsonFromMessage } from '../../helpers/extractJsonFromMessage';
import { fileUploader } from '../../helpers/fileUploader';
import { openai } from '../../helpers/openAIsdk';
import { paginationHelper } from '../../helpers/paginationHelper';
import { doctorSearchableFields } from './doctor.constant';
import { IDoctorUpdateInput } from './doctor.interface';

// Create Doctor Service
const createDoctor = async (req: Request & { file?: Express.Multer.File }) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.doctor.profilePhoto = uploadResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(
        req.body.password,
        config.salt_rounds ? parseInt(config.salt_rounds) : 10
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

const getAISuggestionFromDB = async (payload: { symptoms: string }) => {
    // Implement your logic to get AI suggestions based on the payload
    if (!(payload && payload.symptoms)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Symptoms are required');
    }

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
        },
    });

    const prompt = `
You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data.
`;

    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: 'system',
                content:
                    'You are a helpful AI medical assistant that provides doctor suggestions.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const result = await extractJsonFromMessage(completion.choices[0].message);
    return result;
};

export const DoctorService = {
    createDoctor,
    getAllDoctorsFromDB,
    updateDoctorInDB,
    getAISuggestionFromDB,
};
