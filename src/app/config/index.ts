import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    salt_rounds: process.env.SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    reset_token: process.env.RESET_TOKEN,
    reset_token_expires_in: process.env.RESET_TOKEN_EXPIRES_IN,
    reset_pass_link: process.env.RESET_PASS_LINK,
    emailSender: {
        email: process.env.EMAIL_SENDER_EMAIL,
        app_pass: process.env.EMAIL_SENDER_APP_PASS,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
    },
    openrouter_api_key: process.env.OPENROUTER_API_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.webhookSecret,
};
