import { NextFunction, Request, Response } from 'express';
import { JwtHelper } from '../helpers/jwtHelper';

const auth = (...roles: string[]) => {
    return async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token = req.cookies.accessToken;

            if (!token) {
                throw new Error('Unauthorized: No token provided');
            }

            const verifyUser = JwtHelper.verifyToken(
                token,
                process.env.JWT_ACCESS_SECRET as string
            );

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new Error(
                    'Forbidden:  You do not have access to this resource'
                );
            }
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
};

export default auth;
