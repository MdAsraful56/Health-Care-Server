import bcrypt from 'bcryptjs';
import { Request } from 'express';
import config from '../../config';
import prisma from '../../config/db';
import { fileUploader } from '../../helpers/fileUploader';
const createAdmin = async (
    req: Request & {
        file?: Express.Multer.File;
        body: { admin: any; password: string };
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

export const AdminService = {
    createAdmin,
};
