import { UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { JwtHelper } from '../../helpers/jwtHelper';
import emailSender from './emailSender';

const login = async (payload: { email: string; password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE,
        },
    });

    const isCorrectPassword = await bcrypt.compare(
        payload.password,
        user.password
    );
    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect!');
    }

    const accessToken = JwtHelper.generateTokens(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt_access_secret as Secret,
        config.jwt_access_expires_in as string
    );

    const refreshToken = JwtHelper.generateTokens(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt_refresh_secret as Secret,
        config.jwt_refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = JwtHelper.verifyToken(
            token,
            config.jwt_refresh_secret as Secret
        );
    } catch (err) {
        throw new Error('You are not authorized!');
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE,
        },
    });

    const accessToken = JwtHelper.generateTokens(
        {
            userId: userData.id,
            email: userData.email,
            role: userData.role,
        },
        config.jwt_access_secret as Secret,
        config.jwt_access_expires_in as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    };
};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE,
        },
    });

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.oldPassword,
        userData.password
    );

    if (!isCorrectPassword) {
        throw new Error('Password Incorrect!');
    }

    const hashedPassword: string = await bcrypt.hash(
        payload.newPassword,
        Number(config.salt_rounds)
    );

    await prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });

    return {
        message: 'Password changed successfully!',
    };
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE,
        },
    });

    const resetPassToken = JwtHelper.generateTokens(
        { email: userData.email, role: userData.role },
        config.reset_token as Secret,
        config.reset_token_expires_in as string
    );

    const resetPassLink =
        config.reset_pass_link +
        `?userId=${userData.id}&token=${resetPassToken}`;

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    );
};

const resetPassword = async (
    token: string,
    payload: { id: string; password: string }
) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE,
        },
    });

    const isValidToken = JwtHelper.verifyToken(
        token,
        config.reset_token as Secret
    );

    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
    }

    // hash password
    const password = await bcrypt.hash(
        payload.password,
        Number(config.salt_rounds)
    );

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password,
        },
    });
};

const getMe = async (session: any) => {
    const accessToken = session.accessToken;
    const decodedData = JwtHelper.verifyToken(
        accessToken,
        config.jwt_access_secret as Secret
    );

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE,
        },
    });

    const { id, email, role, needPasswordChange, status } = userData;

    return {
        id,
        email,
        role,
        needPasswordChange,
        status,
    };
};

export const AuthService = {
    login,
    changePassword,
    forgotPassword,
    refreshToken,
    resetPassword,
    getMe,
};
