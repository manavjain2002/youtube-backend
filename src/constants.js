import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT;
export const dbUrl = process.env.DB_URI;
export const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
export const cloudApiKey = process.env.CLOUDINARY_API_KEY;
export const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;
export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
export const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
export const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};
