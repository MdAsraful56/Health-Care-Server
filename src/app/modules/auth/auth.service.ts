import { UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db';

const login = async (payload: { email: string; password: string }) => {
    // Implement your login logic here

    if (!payload) {
        throw new Error('Invalid login payload');
    }

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE,
        },
    });

    const isCorrectpassword = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isCorrectpassword) {
        throw new Error('Password is incorrect');
    }

    const accessToken = jwt.sign(
        { email: user.email, role: user.role },
        'qwe',
        {
            algorithm: 'HS256',
            expiresIn: '1d',
        }
    );
    return {
        accessToken,
    };
};

export const AuthService = {
    login,
};
