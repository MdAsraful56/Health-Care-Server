import * as jwt from 'jsonwebtoken';
import { Secret, SignOptions } from 'jsonwebtoken';

const generateTokens = (payload: object, secret: Secret, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn,
    } as SignOptions);

    return token as string;
};

const verifyToken = (token: string, secret: string) => {
    const verifiedToken = jwt.verify(token, secret);
    return verifiedToken;
};

export const JwtHelper = {
    generateTokens,
    verifyToken,
};
