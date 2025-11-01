import { UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../../config/db';
import { JwtHelper } from '../../helpers/jwtHelper';

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

    const accessToken = JwtHelper.generateTokens(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET as string,
        process.env.JWT_ACCESS_EXPIRES_IN as string
    );

    const refreshToken = JwtHelper.generateTokens(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_REFRESH_SECRET as string,
        process.env.JWT_REFRESH_EXPIRES_IN as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
    };
};

export const AuthService = {
    login,
};
